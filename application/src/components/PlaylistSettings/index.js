import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router'
import axios from 'axios'
import io from 'socket.io-client'

import GenresInput from './GenresInput'
import { msToMin } from '../../utils'
import { validatePlaylistSettings } from './utils'
import constants, { MESSAGES } from '../../constants'

import './index.scss'

const { BACKEND_ADDRESS, UPDATED_PARTY } = constants

function PlaylistSettings({
  history,
  userData,
  partyData,
  connectedToParty,
  setSnackbarOpen,
  setSnackbarMessage,
}) {
  const { userID, displayName } = userData

  const [playlistName, setPlaylistName] = useState(partyData.playlistName)
  const [playlistGenres, setPlaylistGenres] = useState(
    partyData.genres === null ? '' : partyData.genres.join(','),
  )
  const [playlistMaxDuration, setPlaylistMaxDuration] = useState(
    msToMin(partyData.maxDuration) > 0 ? msToMin(partyData.maxDuration) : null,
  )

  useEffect(() => {
    const createParty = async () => {
      const response = await axios({
        method: 'post',
        url: `${BACKEND_ADDRESS}/parties/createParty`,
        data: {
          userID,
        },
      })

      const partyData = response.data
      connectedToParty(partyData)
    }

    if (!partyData.playlistID) {
      createParty()
    }
  }, [])

  const handleChange = (event, field) => {
    switch (field) {
      case 'name':
        setPlaylistName(event.target.value)
        break
      case 'genres':
        setPlaylistGenres(event.target.value)
        break
      case 'maxDuration':
        setPlaylistMaxDuration(event.target.value)
        break
    }
  }

  const handleSubmit = (event) => {
    if (
      !validatePlaylistSettings({
        playlistName,
        genres: playlistGenres,
        maxDuration: playlistMaxDuration,
      })
    ) {
      event.preventDefault()
      setSnackbarMessage(MESSAGES.INVALID_PLAYLIST_SETTINGS)
      setSnackbarOpen(true)
    } else {
      event.preventDefault()
      const socket = io.connect(BACKEND_ADDRESS)
      const { playlistID } = partyData
      const genres =
        playlistGenres !== ''
          ? playlistGenres
              .split(',')
              .filter((genre) => genre !== '')
              .map((genre) => genre.trim())
          : null

      const updateParty = async () => {
        const response = await axios({
          method: 'put',
          url: `${BACKEND_ADDRESS}/parties/updateParty`,
          data: {
            playlistID,
            playlistName,
            genres,
            maxDurationMinutes: playlistMaxDuration,
          },
        })

        const updatedPartyInfo = response.data
        socket.emit(UPDATED_PARTY, { playlistID })
        // socket.disconnect()
        connectedToParty(updatedPartyInfo)
        history.push(`/room/${playlistID}`)
      }

      updateParty()
    }
  }

  return (
    <div className="playlistSettingsContainer">
      <div className="innerPlaylistSettingsContainer">
        <h1 className="pageTitle">Playlist Settings</h1>
        <p className="loggedInAs">(Logged in as {displayName})</p>
        <p className="note">
          Note: genres should be a comma-separated list of valid genres. If you
          want to include all genres, leave the field blank.
        </p>
        <form className="playlistSettingsForm" onSubmit={handleSubmit}>
          <input
            className="inputField"
            type="text"
            value={playlistName}
            placeholder="name"
            onChange={(event) => handleChange(event, 'name')}
          />
          <GenresInput
            playlistGenres={playlistGenres}
            setPlaylistGenres={setPlaylistGenres}
          />
          <input
            className="inputField"
            type="text"
            value={playlistMaxDuration}
            placeholder="max duration (mins)"
            onChange={(event) => handleChange(event, 'maxDuration')}
          />
          <br />
          <input className="submitButton" type="submit" value="Submit" />
        </form>
      </div>
    </div>
  )
}

PlaylistSettings.propTypes = {
  connectedToParty: PropTypes.func,
  history: PropTypes.shape({
    push: PropTypes.func,
  }),
  partyData: PropTypes.shape({
    genres: PropTypes.shape({
      join: PropTypes.func,
    }),
    maxDuration: PropTypes.any,
    playlistID: PropTypes.any,
    playlistName: PropTypes.any,
  }),
  setSnackbarMessage: PropTypes.func,
  setSnackbarOpen: PropTypes.func,
  userData: PropTypes.shape({
    displayName: PropTypes.any,
    userID: PropTypes.any,
  }),
}

export default withRouter(PlaylistSettings)
