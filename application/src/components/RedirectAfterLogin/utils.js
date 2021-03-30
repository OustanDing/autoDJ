import axios from 'axios'

import { msToMin } from '../../utils'
import constants from '../../constants'

const { BACKEND_ADDRESS } = constants

export async function fetchPartyInfoAndJoinParty({
  playlistID,
  userID,
  connectedToParty,
}) {
  const fetchPartyInfoResponse = await axios({
    method: 'get',
    url: `${BACKEND_ADDRESS}/parties/getPartyInfo/${playlistID}`,
  })
  const partyData = fetchPartyInfoResponse.data

  await axios({
    method: 'put',
    url: `${BACKEND_ADDRESS}/parties/joinParty`,
    data: {
      userID,
      playlistID,
    },
  })

  const { playlistName, maxDuration, genres } = partyData
  const updatePartyResponse = await axios({
    method: 'put',
    url: `${BACKEND_ADDRESS}/parties/updateParty`,
    data: {
      playlistName,
      playlistID,
      maxDurationMinutes: msToMin(maxDuration),
      genres,
    },
  })

  connectedToParty(updatePartyResponse.data)
}
