import React from 'react'
import PropTypes from 'prop-types'
import CountUp from 'react-countup'
import VisibilitySensor from 'react-visibility-sensor'

function MetricCounter({ number }) {
  return (
    <CountUp start={0} end={number} duration={3} redraw={true}>
      {({ countUpRef, start }) => (
        <VisibilitySensor onChange={start} delayedCall>
          <span ref={countUpRef} />
        </VisibilitySensor>
      )}
    </CountUp>
  )
}

MetricCounter.propTypes = {
  number: PropTypes.any,
}

export default MetricCounter
