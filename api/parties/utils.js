const axios = require('axios')
const User = require('../models/User')
const Party = require('../models/Party')

async function getPartyInfo(playlistID) {
  const partyInfo = await Party.findOne({
    playlistID,
  })

  return partyInfo
}

async function createSpotifyPlaylist({ spotifyID, playlistName, accessToken }) {
  try {
    const newPlaylist = await axios({
      method: 'POST',
      url: `https://api.spotify.com/v1/users/${spotifyID}/playlists`,
      data: JSON.stringify({
        name: playlistName,
        public: false,
        collaborative: true,
        description: 'Created by autoDJ',
      }),
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    })
    return newPlaylist.data
  } catch (err) {
    console.log(err.response.data.error)
  }
}

async function createParty({ host, playlistName, playlistID }) {
  const partyInfo = {
    members: [host],
    host,
    playlistName,
    playlistID,
  }
  const newParty = await new Party(partyInfo).save()

  await addUserToParty({
    userID: host,
    playlistID,
    role: 'host',
  })

  return newParty
}

async function updateParty({ playlistName, playlistID, genres, maxDuration }) {
  const updatedParty = await Party.updateOne(
    {
      playlistID,
    },
    {
      $set: {
        playlistName,
        genres,
        maxDuration,
      },
    },
    {
      new: true,
    },
  )

  return updatedParty
}

async function addUserToParty({ userID, playlistID, role }) {
  await User.findByIdAndUpdate(
    userID,
    {
      $addToSet: { parties: playlistID },
    },
    {
      new: true,
    },
  )

  const updatedParty = await Party.findOneAndUpdate(
    {
      playlistID,
    },
    {
      $addToSet: { members: userID },
    },
    {
      new: true,
    },
  )

  return updatedParty
}

async function updateSpotifyPlaylistTitle({
  playlistName,
  playlistID,
  accessToken,
}) {
  try {
    await axios({
      method: 'put',
      url: `https://api.spotify.com/v1/playlists/${playlistID}`,
      data: JSON.stringify({
        name: playlistName,
      }),
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    })

    return playlistID
  } catch (err) {
    console.log(err.response.data.error)
  }
}

module.exports = {
  getPartyInfo,
  createSpotifyPlaylist,
  createParty,
  updateParty,
  addUserToParty,
  updateSpotifyPlaylistTitle,
}
