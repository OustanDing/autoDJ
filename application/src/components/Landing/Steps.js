import React from 'react'
import PropTypes from 'prop-types'

import step1 from '../../images/step1.png'
import step2 from '../../images/step2.png'
import step3 from '../../images/step3.png'

const stepsData = [
  {
    title: 'Connect your Spotify account',
    description:
      'Log into Spotify to let us analyze your tastes and make a new playlist. Your information and existing playlists will be left alone.',
    icon: step1,
  },
  {
    title: 'Select what you want to hear',
    description:
      "Choose from Spotify's most popular genres and give your playlist a title and max duration.",
    icon: step2,
  },
  {
    title: 'Start vibing 😎',
    description:
      'Invite your friends and watch their top tracks pop up in your playlist. Play the playlist on autoDJ or in your Spotify app.',
    icon: step3,
  },
]

function Steps() {
  return (
    <div className="innerStepsContainer">
      {stepsData.map((step, i) => (
        <StepBox
          key={i}
          stepNumber={i + 1}
          title={step.title}
          description={step.description}
          icon={step.icon}
        />
      ))}
    </div>
  )
}

function StepBox({ stepNumber, title, description, icon }) {
  return (
    <div>
      <div className="stepBox">
        <img className="stepIcon" src={icon} />
        <h4 className="stepTitle">
          {stepNumber}. {title}
        </h4>
        <p className="stepDescription">{description}</p>
      </div>{' '}
    </div>
  )
}

StepBox.propTypes = {
  description: PropTypes.string,
  icon: PropTypes.any,
  stepNumber: PropTypes.number,
  title: PropTypes.string,
}

export default Steps
