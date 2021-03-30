import React, { useState } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { connect } from 'react-redux'
import { Snackbar } from '@material-ui/core'

import {
  loginRequest,
  loginSuccess,
  loginFailure,
} from '../actions/userActions'
import {
  createParty,
  joinParty,
  connectedToParty,
} from '../actions/partyActions'
import Routes from '../Routes'
import { DEFAULT_SNACKBAR_PROPS } from '../constants'

import './App.scss'

function App(props) {
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')

  return (
    <div className="app">
      <img id="backgroundImage" src="/images/backgroundImage.png" />
      <Router>
        <Routes
          setSnackbarOpen={setSnackbarOpen}
          setSnackbarMessage={setSnackbarMessage}
          {...props}
        />
      </Router>
      <Snackbar
        open={snackbarOpen}
        message={snackbarMessage}
        onClose={() => setSnackbarOpen(false)}
        classes={{ root: 'snackbar' }}
        {...DEFAULT_SNACKBAR_PROPS}
      />
    </div>
  )
}

function mapStateToProps(state) {
  return {
    isAuthenticating: state.userReducer.isAuthenticating,
    isAuthenticated: state.userReducer.isAuthenticated,
    userData: state.userReducer.userData,
    isHost: state.partyReducer.isHost,
    partyData: state.partyReducer.partyData,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    loginRequest: () => dispatch(loginRequest()),
    loginSuccess: (userData) => dispatch(loginSuccess(userData)),
    loginFailure: () => dispatch(loginFailure()),
    createParty: () => dispatch(createParty()),
    joinParty: () => dispatch(joinParty()),
    connectedToParty: (partyData) => dispatch(connectedToParty(partyData)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
