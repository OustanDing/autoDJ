import React from 'react'
import PropTypes from 'prop-types'

import constants, { MESSAGES } from '../../constants'

import './CopyLink.scss'

const { FRONTEND_ADDRESS } = constants

function CopyLink({ playlistID, setSnackbarOpen, setSnackbarMessage }) {
  const playlistURL = `${FRONTEND_ADDRESS}/room/${playlistID}`

  const copyPlaylistURLToClipboard = () => {
    navigator.clipboard.writeText(playlistURL)
    setSnackbarMessage(MESSAGES.LINK_COPIED)
    setSnackbarOpen(true)
  }

  return (
    <div className="copyLinkContainer">
      <p className="inviteFriendsText">Party URL (click to copy):</p>
      <p className="playlistURLTextBox" onMouseUp={copyPlaylistURLToClipboard}>
        {playlistURL}
      </p>
    </div>
  )
}

CopyLink.propTypes = {
  playlistID: PropTypes.string,
  setSnackbarMessage: PropTypes.func,
  setSnackbarOpen: PropTypes.func,
}

export default CopyLink
