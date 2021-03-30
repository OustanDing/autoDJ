import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import 'axios'

import constants, { MESSAGES } from '../../constants'

import './FollowPlaylistButton.scss'
import axios from 'axios'

const { BACKEND_ADDRESS } = constants

function FollowPlaylistButton({
  accessToken,
  spotifyID,
  playlistID,
  setSnackbarOpen,
  setSnackbarMessage,
}) {
  const [isFollowing, setIsFollowing] = useState(false)

  useEffect(() => {
    const getUserIsFollowing = async () => {
      const response = await axios({
        method: 'get',
        url: `${BACKEND_ADDRESS}/users/checkIfUserFollowsPlaylist?playlistID=${playlistID}&accessToken=${accessToken}&spotifyID=${spotifyID}`,
      })
      setIsFollowing(response.data)
    }

    getUserIsFollowing()
  }, [])

  const handleClick = async () => {
    if (isFollowing) {
      const response = await axios({
        method: 'delete',
        url: `${BACKEND_ADDRESS}/users/unfollowPlaylist?playlistID=${playlistID}&accessToken=${accessToken}`,
      })
      setIsFollowing(response.data)
      setSnackbarMessage(MESSAGES.UNFOLLOWED_PLAYLIST)
      setSnackbarOpen(true)
    } else {
      const response = await axios({
        method: 'put',
        url: `${BACKEND_ADDRESS}/users/followPlaylist?playlistID=${playlistID}&accessToken=${accessToken}`,
      })
      setIsFollowing(response.data)
      setSnackbarMessage(MESSAGES.FOLLOWED_PLAYLIST)
      setSnackbarOpen(true)
    }
  }

  return (
    <button
      className={`followPlaylistButton ${
        isFollowing ? 'following' : 'notFollowing'
      }`}
      onClick={handleClick}
    >
      {isFollowing ? 'Following' : 'Follow'}
    </button>
  )
}

FollowPlaylistButton.propTypes = {
  accessToken: PropTypes.string,
  playlistID: PropTypes.string,
  setSnackbarMessage: PropTypes.func,
  setSnackbarOpen: PropTypes.func,
  spotifyID: PropTypes.string,
}

export default FollowPlaylistButton
