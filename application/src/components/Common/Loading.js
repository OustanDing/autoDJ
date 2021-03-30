import React from 'react'
import PropTypes from 'prop-types'
import { CircularProgress } from '@material-ui/core'

import './Loading.scss'

const LOADING_SPINNER_SIZE = 72

function Loading({ text = 'Connecting you to the party...' }) {
  return (
    <div className="loadingWrapper">
      <h3>{text}</h3>
      <CircularProgress
        variant="indeterminate"
        color="primary"
        size={LOADING_SPINNER_SIZE}
        classes={{
          circle: 'progressSpinner',
        }}
      />
    </div>
  )
}

Loading.propTypes = {
  text: PropTypes.string,
}

export default Loading
