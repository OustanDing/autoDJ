import React from 'react'
import PropTypes from 'prop-types'
import { Route, Redirect } from 'react-router-dom'

function ProtectedRoute({
  component: Component,
  isAuthenticated,
  isAuthenticating,
  ...routeProps
}) {
  const handleRender = (props) => {
    if (isAuthenticating) {
      return <div />
    } else {
      if (isAuthenticated) {
        return <Component {...props} {...routeProps} />
      } else {
        return <Redirect to={'/'} />
      }
    }
  }

  return <Route render={handleRender} />
}

ProtectedRoute.propTypes = {
  component: PropTypes.node,
  isAuthenticated: PropTypes.bool,
  isAuthenticating: PropTypes.bool,
}

export default ProtectedRoute
