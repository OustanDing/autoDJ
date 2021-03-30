import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import Slider from 'react-slick'

import HostParty from './HostParty'
import JoinParty from './JoinParty'
import Steps from './Steps'
import MetricCounter from '../Common/MetricCounter'
import constants, { MESSAGES } from '../../constants'
import { validatePartyURL } from './utils'
import spotifyLogo from '../../images/spotifyLogoGreen.png'
import downChevron from '../../images/downChevron.png'
import logo from '../../images/logo.png'

import screenshotHomepage from '../../images/screenshotHomepage.png'
import screenshotPlaylistSettings from '../../images/screenshotPlaylistSettings.png'
import screenshotRoom from '../../images/screenshotRoom.png'
import screenshotBigRoom from '../../images/screenshotBigRoom.png'

import './index.scss'

const IMAGES = [
  screenshotHomepage,
  screenshotPlaylistSettings,
  screenshotRoom,
  screenshotBigRoom,
]
const SLIDER_SETTINGS = {
  dots: false,
  autoplay: true,
  swipe: false,
  arrows: false,
  infinite: true,
  pauseOnHover: false,
  autoplaySpeed: 3000,
}
const { BACKEND_ADDRESS } = constants

function Landing({ loginRequest, setSnackbarOpen, setSnackbarMessage }) {
  const [retrievingMetrics, setRetrievingMetrics] = useState(true)
  const [numUsers, setNumUsers] = useState(69)
  const [numParties, setNumParties] = useState(420)

  const createParty = async () => {
    loginRequest()

    window.location.href = `${BACKEND_ADDRESS}/auth/login?userType=host`
  }

  const joinParty = async (partyURL) => {
    const partyURLIsValid = await validatePartyURL(partyURL)

    if (partyURLIsValid) {
      window.location.href = partyURL
    } else {
      setSnackbarMessage(MESSAGES.INVALID_PLAYLIST_JOIN)
      setSnackbarOpen(true)
    }
  }

  useEffect(() => {
    const getMetrics = async () => {
      setRetrievingMetrics(true)
      const response = await axios({
        method: 'get',
        url: `${BACKEND_ADDRESS}/metrics/getCurrentMetrics`,
      })

      setNumUsers(response.data.numUsers)
      setNumParties(response.data.numParties)
      setRetrievingMetrics(false)
    }

    getMetrics()
  }, [])

  return (
    <div id="landingContainer">
      <a id="top" />
      <div className="mainLandingContainer">
        <div className="titleContainer">
          <img className="mainLandingLogo" src={logo} />
          <h1 className="title">autoDJ</h1>
          <div className="poweredByContainer">
            <h4 className="poweredByText">powered by</h4>
            <img className="spotifyLogo" src={spotifyLogo} />
          </div>
          <p className="description">
            A custom Spotify playlist generator for your party that combines
            everyone&apos;s music tastes!
          </p>
        </div>
        <div className="featuresContainer">
          <HostParty createParty={createParty} />
          <JoinParty joinParty={joinParty} />
        </div>
        <a className="downChevronLinkWrapper" href="#steps">
          <img className="downChevron" src={downChevron} />
        </a>
      </div>
      <a id="steps" />
      <div className="stepsContainer">
        <Steps />
      </div>
      <div className="infoContainer">
        <h2 className="infoHeader">Welcome to the party.</h2>
        {!retrievingMetrics && (
          <h4 className="metrics">
            Join <MetricCounter number={numUsers} /> listeners in{' '}
            <MetricCounter number={numParties} /> parties
          </h4>
        )}
        <div className="sliderContainer">
          <Slider {...SLIDER_SETTINGS}>
            {IMAGES.map((image, i) => (
              <img src={image} key={i} />
            ))}
          </Slider>
        </div>

        {/* <img className="partyScreenshot" src={partyScreenshot} /> */}
      </div>
      <div className="footer">
        <a className="footerLogoLink" href="#top">
          <img className="footerLogo" src={logo} />
        </a>
        <div className="linksContainer">
          <a
            className="footerLink"
            href="https://github.com/OustanDing/AutoDJ"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
          <a
            className="footerLink"
            href="https://forms.gle/ANySPM2hCQXGZRrU6"
            target="_blank"
            rel="noreferrer"
          >
            Feedback
          </a>
        </div>
      </div>
    </div>
  )
}

Landing.propTypes = {
  loginRequest: PropTypes.func,
  setSnackbarMessage: PropTypes.func,
  setSnackbarOpen: PropTypes.func,
}

export default Landing
