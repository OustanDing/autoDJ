const fs = require('fs')
const path = require('path')
const axios = require('axios')
const Party = require('../models/Party')
const { getUserTopTracks } = require('../users/utils')

const ARTIST_TO_GENRES_PATH = path.join(__dirname, 'artistToGenres.json')

async function createSongBank({ accessToken, members }) {
  let songBank = []
  for (const member of members) {
    const { accessToken } = member

    const memberTopTracksInfo = await getUserTopTracks(accessToken)
    const memberSongs =
      memberTopTracksInfo !== null ? memberTopTracksInfo.items : []
    songBank = songBank.concat(memberSongs)
  }

  const songBankWithGenres = await getSongBankWithGenres({
    accessToken,
    songBank,
  })

  return songBankWithGenres
}

async function filterSongBank({ playlistID, songBank, genres, maxDuration }) {
  // score is the number of users who have the song in their top tracks

  const filteredSongBankMap = {}

  if (genres === null) {
    for (const song of songBank) {
      if (song.uri in filteredSongBankMap) {
        filteredSongBankMap[song.uri].score++
      } else {
        filteredSongBankMap[song.uri] = {
          ...song,
          score: 1,
        }
      }
    }
  } else {
    for (const song of songBank) {
      const { genres: songGenres } = song
      for (const genre of genres) {
        if (songGenres.includes(genre)) {
          if (song.uri in filteredSongBankMap) {
            filteredSongBankMap[song.uri].score++
          } else {
            filteredSongBankMap[song.uri] = {
              ...song,
              score: 1,
            }
          }
          break
        }
      }
    }
  }

  const shuffledSongBank = shuffleSongBank(Object.values(filteredSongBankMap))
  const filteredSongBank = shuffledSongBank.sort((a, b) =>
    a.score < b.score ? 1 : -1,
  )
  const filteredSongList = []
  let filteredSongListDuration = 0

  for (const song of filteredSongBank) {
    if (filteredSongListDuration + song.duration_ms > maxDuration) {
      continue
    }

    filteredSongList.push(song)
    filteredSongListDuration += parseInt(song.duration_ms)
  }

  await Party.findOneAndUpdate(
    { playlistID },
    { $set: { duration: filteredSongListDuration, songs: filteredSongList } },
  )

  const filteredSongListURIs = filteredSongList.map((song) => song.uri)

  return filteredSongListURIs
}

async function updateSongsInPlaylist({
  accessToken,
  songListURIs,
  playlistID,
}) {
  try {
    const updatedPlaylistSnapshotID = await axios({
      method: 'PUT',
      url: `https://api.spotify.com/v1/playlists/${playlistID}/tracks`,
      data: {
        uris: songListURIs,
      },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    return updatedPlaylistSnapshotID.data
  } catch (err) {
    console.log(err.response.data.error)
  }
}

async function getSongBankWithGenres({ accessToken, songBank }) {
  const artistToGenresText = fs.readFileSync(ARTIST_TO_GENRES_PATH, 'utf-8')
  const artistToGenres = JSON.parse(artistToGenresText.toString())

  const unknownArtistIDs = []
  const songBankWithGenres = []

  for (const song of songBank) {
    const { artists } = song
    const artistID = artists[0].id // For now, only consider the genres of the first artist (presumed to be main artist)
    if (!(artistID in artistToGenres)) {
      unknownArtistIDs.push(artistID)
    }
  }

  if (unknownArtistIDs.length !== 0) {
    const response = await axios({
      method: 'GET',
      url: `https://api.spotify.com/v1/artists?ids=${encodeURIComponent(
        unknownArtistIDs.join(','),
      )}`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    })

    const unknownArtistsInfo = response.data.artists
    for (const artist of unknownArtistsInfo) {
      artistToGenres[artist.id] = artist.genres
    }
  }

  for (const song of songBank) {
    const { artists } = song
    const artistID = artists[0].id
    songBankWithGenres.push({
      ...song,
      genres: artistToGenres[artistID],
    })
  }

  const shuffledSongBankWithGenres = shuffleSongBank(songBankWithGenres)

  fs.writeFileSync(
    ARTIST_TO_GENRES_PATH,
    JSON.stringify(artistToGenres, null, 2),
  )

  return shuffledSongBankWithGenres
}

function shuffleSongBank(songBank) {
  const shuffledSongBank = [...songBank]
  for (let i = shuffledSongBank.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * i)
    const temp = shuffledSongBank[i]
    shuffledSongBank[i] = shuffledSongBank[j]
    shuffledSongBank[j] = temp
  }
  return shuffledSongBank
}

module.exports = {
  createSongBank,
  filterSongBank,
  updateSongsInPlaylist,
}
