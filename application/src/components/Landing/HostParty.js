import React from 'react'
import PropTypes from 'prop-types'

function HostParty({ createParty }) {
  const handleCreateParty = () => {
    createParty()
  }

  return (
    <div className="featureBox">
      <h3>Host a Party</h3>
      <p>
        Make a party and invite friends to build a playlist based on
        everyone&apos;s Spotify data
      </p>
      <button className="getStartedButton" onClick={handleCreateParty}>
        Get started
      </button>
    </div>
  )
}

HostParty.propTypes = {
  createParty: PropTypes.func,
}

export default HostParty
