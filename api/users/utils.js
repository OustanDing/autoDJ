const axios = require('axios')
const User = require('../models/User')

async function getUserInfo(userID) {
  const userInfo = await User.findById(userID)

  return userInfo
}

async function getUsersInfo(userIDs) {
  const usersInfo = await User.find({
    _id: {
      $in: userIDs,
    },
  })

  return usersInfo
}

async function getUserTopTracks(accessToken) {
  try {
    const topTracks = await axios({
      method: 'GET',
      url: 'https://api.spotify.com/v1/me/top/tracks',
      query: {
        time_range: 'medium_term',
        limit: 50,
      },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    return topTracks.data
  } catch (err) {
    console.log(err.response.data.error)
    return null
  }
}

async function followPlaylist({ playlistID, accessToken }) {
  try {
    await axios({
      method: 'PUT',
      url: `https://api.spotify.com/v1/playlists/${playlistID}/followers`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    })

    return playlistID
  } catch (err) {
    console.log(err)
  }
}

async function unfollowPlaylist({ playlistID, accessToken }) {
  try {
    await axios({
      method: 'DELETE',
      url: `https://api.spotify.com/v1/playlists/${playlistID}/followers`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    return playlistID
  } catch (err) {
    console.log(err)
  }
}

async function checkIfUserFollowsPlaylist({
  playlistID,
  spotifyID,
  accessToken,
}) {
  try {
    const response = await axios({
      method: 'GET',
      url: `https://api.spotify.com/v1/playlists/${playlistID}/followers/contains`,
      query: {
        ids: spotifyID,
      },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    return response.data[0]
  } catch (err) {
    console.log(err)
  }
}

module.exports = {
  getUserInfo,
  getUsersInfo,
  getUserTopTracks,
  followPlaylist,
  unfollowPlaylist,
  checkIfUserFollowsPlaylist,
}
