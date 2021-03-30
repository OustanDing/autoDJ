const express = require('express')

const {
  getUserInfo,
  getUsersInfo,
  followPlaylist,
  unfollowPlaylist,
  checkIfUserFollowsPlaylist,
} = require('./utils')

const router = express.Router()

router.get('/getUserInfo', async (req, res) => {
  try {
    const { userID } = req.query
    const userInfo = await getUserInfo(userID)
    res.status(200).send(userInfo)
  } catch (err) {
    res.status(400).send(err)
  }
})

router.get('/getUsersInfo', async (req, res) => {
  try {
    const { userIDs: userIDsRaw } = req.query
    const userIDs = JSON.parse(userIDsRaw)
    const usersInfo = await getUsersInfo(userIDs)
    res.status(200).send(usersInfo)
  } catch (err) {
    res.status(400).send(err)
  }
})

router.put('/followPlaylist', async (req, res) => {
  try {
    const { playlistID, accessToken } = req.query
    await followPlaylist({ playlistID, accessToken })
    res.status(200).send(true)
  } catch (err) {
    res.status(400).send(err)
  }
})

router.delete('/unfollowPlaylist', async (req, res) => {
  try {
    const { playlistID, accessToken } = req.query
    await unfollowPlaylist({
      playlistID,
      accessToken,
    })
    res.status(200).send(false)
  } catch (err) {
    res.status(400).send(err)
  }
})

router.get('checkIfUserFollowsPlaylist', async (req, res) => {
  try {
    const { playlistID, spotifyID, accessToken } = req.query
    const isFollowing = await checkIfUserFollowsPlaylist({
      playlistID,
      spotifyID,
      accessToken,
    })
    res.status(200).send(isFollowing)
  } catch (err) {
    res.status(400).send(err)
  }
})

module.exports = router
