export const loginRequest = () => {
  return {
    type: 'LOGIN_REQUEST',
  }
}

export const loginSuccess = (userData) => {
  return {
    type: 'LOGIN_SUCCESS',
    userData,
  }
}

export const loginFailure = () => {
  return {
    type: 'LOGIN_FAILURE',
  }
}
