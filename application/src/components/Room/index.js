import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router'
import io from 'socket.io-client'

import Player from './Player'
import Members from './Members'
import CopyLink from './CopyLink'
import FollowPlaylistButton from './FollowPlaylistButton'
import Loading from '../Common/Loading'
import { msToMinString } from '../../utils'
import constants, { MESSAGES } from '../../constants'

import './index.scss'

const { BACKEND_ADDRESS, UPDATED_PARTY, UPDATED_PARTY_DATA } = constants
const SPOTIFY_PLAYLIST_URL_PREFIX = 'https://open.spotify.com/playlist'
const SPOTIFY_PLAYLIST_URL_SUFFIX = '?go=1'

function Room({
  match,
  isAuthenticated,
  userData,
  isHost,
  partyData,
  createParty,
  connectedToParty,
  setSnackbarOpen,
  setSnackbarMessage,
}) {
  const { spotifyID, accessToken } = userData

  const {
    host,
    playlistID,
    playlistName,
    members,
    genres,
    duration,
  } = partyData

  useEffect(() => {
    const socket = io.connect(BACKEND_ADDRESS)
    const { playlistID: desiredPlaylistID } = match.params

    if (!isAuthenticated) {
      window.location.href = `${BACKEND_ADDRESS}/auth/login?userType=guest&playlistID=${desiredPlaylistID}`
    } else {
      socket.emit(UPDATED_PARTY, { playlistID: desiredPlaylistID })

      socket.on(UPDATED_PARTY_DATA, (updatedPartyData) => {
        connectedToParty(updatedPartyData)
        setSnackbarMessage(MESSAGES.UPDATED_PLAYLIST)
        setSnackbarOpen(true)
      })
    }

    return () => {
      socket.disconnect()
    }
  }, [])

  useEffect(() => {
    const { userID } = userData
    if (userID === partyData.host) {
      createParty()
    }
  }, [partyData])

  const getGenresString = (genres) => {
    if (genres === null) {
      return 'all genres'
    }

    let genresString = genres.join(' • ')

    return genresString
  }

  return playlistID ? (
    <div id="roomContainer">
      <div className="halfContainer playerContainer">
        <Player playlistID={playlistID} />
      </div>
      <div className="halfContainer playlistInfoContainer">
        <div className="playlistInfoContainerTop">
          <div className="playlistHeader">
            <h1 className="playlistName">{playlistName}</h1>
          </div>
          <div className="playlistInfo">
            <h4 className="playlistSubtitle">
              {msToMinString(duration)} | {getGenresString(genres)}
            </h4>
          </div>
          <div className="playlistButtons">
            {isHost ? (
              <EditButton playlistID={playlistID} />
            ) : (
              <FollowPlaylistButton
                playlistID={playlistID}
                spotifyID={spotifyID}
                accessToken={accessToken}
                setSnackbarOpen={setSnackbarOpen}
                setSnackbarMessage={setSnackbarMessage}
              />
            )}
            <OpenInSpotifyButton playlistID={playlistID} />
          </div>
          <CopyLink
            playlistID={playlistID}
            setSnackbarOpen={setSnackbarOpen}
            setSnackbarMessage={setSnackbarMessage}
          />
        </div>
        <div className="playlistInfoContainerBottom">
          <Members host={host} members={members} />
          <p className="startOwnPartyMessage">
            Want to start your own party?{' '}
            <a
              className="startOwnPartyLink"
              href={`${BACKEND_ADDRESS}/auth/login?userType=host`}
              target="_blank"
              rel="noreferrer"
            >
              Click here!
            </a>
          </p>
        </div>
      </div>
    </div>
  ) : (
    <div id="loadingContainer">
      <Loading />
    </div>
  )
}

Room.propTypes = {
  connectedToParty: PropTypes.func,
  createParty: PropTypes.func,
  isAuthenticated: PropTypes.any,
  isHost: PropTypes.any,
  match: PropTypes.shape({
    params: PropTypes.shape({
      playlistID: PropTypes.any,
    }),
  }),
  partyData: PropTypes.shape({
    duration: PropTypes.any,
    genres: PropTypes.shape({
      join: PropTypes.func,
    }),
    host: PropTypes.any,
    maxDuration: PropTypes.any,
    members: PropTypes.any,
    playlistID: PropTypes.any,
    playlistName: PropTypes.any,
  }),
  setSnackbarMessage: PropTypes.func,
  setSnackbarOpen: PropTypes.func,
  userData: PropTypes.shape({
    accessToken: PropTypes.any,
    spotifyID: PropTypes.any,
    userID: PropTypes.any,
  }),
}

function EditButtonRaw({ history }) {
  const handleClick = () => {
    history.push(`/playlistSettings`)
  }

  return (
    <a className="linkButton" onClick={handleClick}>
      Edit
    </a>
  )
}

EditButtonRaw.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func,
  }),
}

const EditButton = withRouter(EditButtonRaw)

function OpenInSpotifyButton({ playlistID }) {
  return (
    <a
      className="linkButton"
      href={`${SPOTIFY_PLAYLIST_URL_PREFIX}/${playlistID}${SPOTIFY_PLAYLIST_URL_SUFFIX}`}
      target="_blank"
      rel="noreferrer"
    >
      Open in Spotify
    </a>
  )
}

OpenInSpotifyButton.propTypes = {
  playlistID: PropTypes.string,
}

export default withRouter(Room)
