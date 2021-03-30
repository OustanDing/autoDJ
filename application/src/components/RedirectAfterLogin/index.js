import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router'
import axios from 'axios'

import Loading from '../Common/Loading'
import { fetchPartyInfoAndJoinParty } from './utils'
import constants from '../../constants'

import './index.scss'

const { BACKEND_ADDRESS } = constants

function RedirectAfterLogin({
  history,
  match,
  isAuthenticating,
  isAuthenticated,
  isHost,
  loginSuccess,
  loginFailure,
  createParty,
  joinParty,
  connectedToParty,
}) {
  const { userID, userType, playlistID } = match.params

  // Verify login
  useEffect(() => {
    const fetchUserInfo = async () => {
      const response = await axios({
        method: 'get',
        url: `${BACKEND_ADDRESS}/users/getUserInfo?userID=${userID}`,
      })

      if (response.status !== 200) {
        loginFailure()
        history.push('/')
        return
      }

      const userInfo = response.data
      loginSuccess(userInfo)
    }

    fetchUserInfo()
    if (userType === 'host') {
      createParty()
    } else if (userType === 'guest') {
      joinParty()
    }
  }, [])

  // Redirect based on store values
  useEffect(
    () => {
      if (isHost && isAuthenticated && !isAuthenticating) {
        history.replace('/playlistSettings')
      } else if (!isHost && isAuthenticated && !isAuthenticating) {
        fetchPartyInfoAndJoinParty({
          playlistID,
          userID,
          connectedToParty,
        })
        history.replace(`/room/${playlistID}`)
      }
    },
    // TODO: Add condition for joining a party
    [isAuthenticated, isAuthenticating],
  )

  return (
    <div className="redirectAfterLoginContainer">
      <Loading />
    </div>
  )
}

RedirectAfterLogin.propTypes = {
  connectedToParty: PropTypes.any,
  createParty: PropTypes.func,
  history: PropTypes.shape({
    push: PropTypes.func,
    replace: PropTypes.func,
  }),
  isAuthenticated: PropTypes.any,
  isAuthenticating: PropTypes.any,
  isHost: PropTypes.any,
  joinParty: PropTypes.func,
  loginFailure: PropTypes.func,
  loginSuccess: PropTypes.func,
  match: PropTypes.shape({
    params: PropTypes.shape({
      userID: PropTypes.any,
      userType: PropTypes.string,
      playlistID: PropTypes.any,
    }),
  }),
}

export default withRouter(RedirectAfterLogin)
