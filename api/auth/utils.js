const axios = require('axios')
const qs = require('qs')

const User = require('../models/User')
const {
  SPOTIFY_CLIENT_ID,
  SPOTIFY_CLIENT_SECRET,
} = require('../config')

async function getUserAccessAndRefreshTokens(authCode, redirectURI) {
  const response = await axios({
    method: 'POST',
    url: 'https://accounts.spotify.com/api/token',
    data: qs.stringify({
      grant_type: 'authorization_code',
      client_id: SPOTIFY_CLIENT_ID,
      client_secret: SPOTIFY_CLIENT_SECRET,
      code: authCode,
      redirect_uri: redirectURI,
    }),
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
  })
  return response.data
}

async function getUserSpotifyInfo(accessToken) {
  const response = await axios.get('https://api.spotify.com/v1/me', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  return response.data
}

async function addUser(authCode, redirectURI) {
  const tokenData = await getUserAccessAndRefreshTokens(authCode, redirectURI)
  const { access_token: accessToken, refresh_token: refreshToken } = tokenData
  const userInfo = await getUserSpotifyInfo(accessToken)
  const {
    display_name: displayName,
    id: spotifyID,
    uri: spotifyURI,
    href: apiEndpoint,
    images,
  } = userInfo

  const savedUserInfo = await User.findOneAndUpdate(
    {
      spotifyID,
    },
    {
      displayName,
      spotifyID,
      spotifyURI,
      apiEndpoint,
      images,
      parties: [],
      accessToken,
      refreshToken,
    },
    {
      upsert: true,
      new: true,
    },
  )

  return savedUserInfo
}

module.exports = { addUser }
