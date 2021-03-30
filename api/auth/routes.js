const express = require('express')

const {
  BACKEND_ADDRESS,
  SPOTIFY_CLIENT_ID,
  FRONTEND_ADDRESS,
} = require('../config')
const { addUser } = require('./utils')

const router = express.Router()
const LOGGED_IN_REDIRECT_URL = `${BACKEND_ADDRESS}/auth/loggedin`
const AUTHENTICATED_REDIRECT_URL = `${FRONTEND_ADDRESS}/redirectAfterLogin`
const FAILED_AUTHENTICATION_REDIRECT_URL = `${FRONTEND_ADDRESS}/`

const SCOPES = [
  'user-read-private',
  'user-read-email',
  'user-top-read',
  'playlist-modify-public',
  'playlist-modify-private',
  'playlist-read-private',
].join(' ')

router.get('/login', (req, res) => {
  const { userType, playlistID = null } = req.query

  let authURL = `https://accounts.spotify.com/authorize?response_type=code&client_id=${SPOTIFY_CLIENT_ID}`
  authURL += `&scope=${encodeURIComponent(SCOPES)}`
  authURL += `&redirect_uri=${encodeURIComponent(LOGGED_IN_REDIRECT_URL)}`

  const stateString = JSON.stringify({
    userType,
    playlistID,
  })

  authURL += `&state=${stateString}`

  res.redirect(authURL)
})

router.get('/loggedin', async (req, res) => {
  try {
    const { code: authCode, error, state } = req.query

    if (error) {
      res.redirect(FAILED_AUTHENTICATION_REDIRECT_URL)
      return
    }

    const stateData = JSON.parse(state)
    const { userType, playlistID } = stateData
    const userInfo = await addUser(authCode, LOGGED_IN_REDIRECT_URL)
    const { _id: userID } = userInfo

    res.redirect(
      `${AUTHENTICATED_REDIRECT_URL}/${userID}/${userType}/${playlistID}`,
    )
  } catch (err) {
    res.status(400).send(err)
  }
})

module.exports = router
