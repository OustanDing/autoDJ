const express = require('express')
const { getUserInfo, getUsersInfo } = require('../users/utils')
const {
  getPartyInfo,
  createSpotifyPlaylist,
  createParty,
  updateParty,
  addUserToParty,
  updateSpotifyPlaylistTitle,
} = require('./utils')
const {
  createSongBank,
  filterSongBank,
  updateSongsInPlaylist,
} = require('./songUtils')

const router = express.Router()

const DEFAULT_PLAYLIST_NAME = 'autoDJ Playlist'

router.get('/getPartyInfo/:playlistID', async (req, res) => {
  try {
    const { playlistID } = req.params
    const partyInfo = await getPartyInfo(playlistID)
    res.status(200).send(partyInfo)
  } catch (err) {
    res.status(400).send(err)
  }
})

router.get('/validatePartyURL', async (req, res) => {
  try {
    const { partyURL } = req.query
    const splitPartyURL = partyURL.split('/')
    const playlistID = splitPartyURL[splitPartyURL.length - 1]
    const partyInfo = await getPartyInfo(playlistID)
    const partyIsValid = partyInfo !== null

    res.status(200).send(partyIsValid)
  } catch (err) {
    res.status(400).send(err)
  }
})

router.get('/checkUserIsPartyHost', async (req, res) => {
  try {
    const { userID, playlistID } = req.query
    const partyInfo = await getPartyInfo(playlistID)
    const { host } = partyInfo
    const userIsPartyHost = host === userID
    res.status(200).send(userIsPartyHost)
  } catch (err) {
    res.status(400).send(err)
  }
})

router.post('/createParty', async (req, res) => {
  try {
    const { userID } = req.body
    const userInfo = await getUserInfo(userID)
    const { accessToken, spotifyID } = userInfo

    const newPlaylist = await createSpotifyPlaylist({
      spotifyID,
      playlistName: DEFAULT_PLAYLIST_NAME,
      accessToken,
    })
    const { name: playlistName, id: playlistID } = newPlaylist

    const newParty = await createParty({
      host: userID,
      playlistName,
      playlistID,
    })

    res.status(201).send(newParty)
  } catch (err) {
    console.log(err)
    res.status(400).send(err)
  }
})

router.put('/updateParty', async (req, res) => {
  const { playlistName, playlistID, maxDurationMinutes, genres } = req.body
  const maxDuration = 60 * 1000 * parseInt(maxDurationMinutes)

  const partyInfo = await getPartyInfo(playlistID)
  const { host, members } = partyInfo
  const userInfo = await getUserInfo(host)
  const { accessToken } = userInfo

  await updateParty({
    playlistName,
    playlistID,
    genres,
    maxDuration,
  })

  const membersInfo = await getUsersInfo(members)
  const songBank = await createSongBank({ accessToken, members: membersInfo })
  const filteredSongBank = await filterSongBank({
    playlistID,
    songBank,
    genres,
    maxDuration,
  })

  await updateSpotifyPlaylistTitle({ playlistName, playlistID, accessToken })
  await updateSongsInPlaylist({
    accessToken,
    songListURIs: filteredSongBank,
    playlistID,
  })

  const updatedPartyInfo = await getPartyInfo(playlistID)

  res.status(200).send(updatedPartyInfo)
})

router.put('/joinParty', async (req, res) => {
  try {
    const { userID, playlistID } = req.body
    const updatedParty = await addUserToParty({
      userID,
      playlistID,
      role: 'guest',
    })

    res.status(200).send(updatedParty)
  } catch (err) {
    console.log(err)
    res.status(400).send(err)
  }
})

module.exports = router
