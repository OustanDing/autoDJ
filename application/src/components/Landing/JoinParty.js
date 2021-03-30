import React from 'react'
import PropTypes from 'prop-types'

const ENTER_KEY_CODE = 13

function JoinParty({ joinParty }) {
  const handleJoinParty = (event) => {
    event.preventDefault()
    if (event.keyCode === ENTER_KEY_CODE) {
      const partyURL = event.target.value
      joinParty(partyURL)
    }
  }

  return (
    <div className="featureBox">
      <h3>Join a Party</h3>
      <p>
        Share your music with the crowd! Paste the party link below and press
        ENTER to begin:
      </p>
      <input className="joinPartyInput" onKeyUp={handleJoinParty} />
    </div>
  )
}

JoinParty.propTypes = {
  joinParty: PropTypes.func,
}

export default JoinParty
