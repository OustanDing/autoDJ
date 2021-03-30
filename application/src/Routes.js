import React from 'react'
import PropTypes from 'prop-types'
import { Switch, Route } from 'react-router-dom'

import ProtectedRoute from './components/ProtectedRoute'
import Landing from './components/Landing'
import PlaylistSettings from './components/PlaylistSettings'
import Room from './components/Room'
import RedirectAfterLogin from './components/RedirectAfterLogin'

function Routes({
  isAuthenticating,
  isAuthenticated,
  userData,
  isHost,
  partyData,
  loginRequest,
  loginSuccess,
  loginFailure,
  createParty,
  joinParty,
  connectedToParty,
  setSnackbarOpen,
  setSnackbarMessage,
}) {
  return (
    <Switch>
      <Route
        exact
        path="/"
        render={(props) => (
          <Landing
            loginRequest={loginRequest}
            setSnackbarOpen={setSnackbarOpen}
            setSnackbarMessage={setSnackbarMessage}
            {...props}
          />
        )}
      />
      <Route
        exact
        path="/redirectAfterLogin/:userID/:userType/:playlistID"
        render={(props) => (
          <RedirectAfterLogin
            isAuthenticating={isAuthenticating}
            isAuthenticated={isAuthenticated}
            isHost={isHost}
            loginSuccess={loginSuccess}
            loginFailure={loginFailure}
            createParty={createParty}
            joinParty={joinParty}
            connectedToParty={connectedToParty}
            {...props}
          />
        )}
      />
      <ProtectedRoute
        exact
        path="/playlistSettings"
        component={PlaylistSettings}
        isAuthenticated={isAuthenticated}
        isAuthenticating={isAuthenticating}
        userData={userData}
        partyData={partyData}
        connectedToParty={connectedToParty}
        setSnackbarOpen={setSnackbarOpen}
        setSnackbarMessage={setSnackbarMessage}
      />
      <Route
        exact
        path="/room/:playlistID"
        render={(props) => (
          <Room
            isAuthenticated={isAuthenticated}
            isAuthenticating={isAuthenticating}
            userData={userData}
            isHost={isHost}
            partyData={partyData}
            createParty={createParty}
            connectedToParty={connectedToParty}
            setSnackbarOpen={setSnackbarOpen}
            setSnackbarMessage={setSnackbarMessage}
            {...props}
          />
        )}
      />
    </Switch>
  )
}

Routes.propTypes = {
  connectedToParty: PropTypes.bool,
  createParty: PropTypes.func,
  isAuthenticated: PropTypes.bool,
  isAuthenticating: PropTypes.bool,
  isHost: PropTypes.bool,
  joinParty: PropTypes.func,
  loginFailure: PropTypes.func,
  loginRequest: PropTypes.func,
  loginSuccess: PropTypes.func,
  partyData: PropTypes.object,
  setSnackbarMessage: PropTypes.func,
  setSnackbarOpen: PropTypes.func,
  userData: PropTypes.object,
}

export default Routes
