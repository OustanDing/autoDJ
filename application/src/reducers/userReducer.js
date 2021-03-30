const defaultState = {
  isAuthenticating: false,
  isAuthenticated: false,
  userData: { userID: '', spotifyID: '', accessToken: '', refreshToken: '' },
}

function userReducer(state = defaultState, action) {
  switch (action.type) {
    case 'LOGIN_REQUEST':
      return {
        ...state,
        isAuthenticating: true,
        isAuthenticated: false,
      }
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        isAuthenticating: false,
        isAuthenticated: true,
        userData: {
          ...action.userData,
          userID: action.userData._id,
        },
      }
    case 'LOGIN_FAILURE':
      return {
        ...state,
        isAuthenticating: false,
        isAuthenticated: false,
      }
    default:
      return state
  }
}

export default userReducer
