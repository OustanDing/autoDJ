import React from 'react'
import PropTypes from 'prop-types'

function Player({ playlistID }) {
  return (
    <iframe
      src={`https://open.spotify.com/embed/playlist/${playlistID}`}
      width="100%"
      height="100%"
      frameBorder="0"
      allowtransparency="true"
      allow="encrypted-media"
    />
  )
}

Player.propTypes = {
  playlistID: PropTypes.string,
}

export default Player
