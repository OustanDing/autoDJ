import axios from 'axios'

import constants from '../../constants'

const { BACKEND_ADDRESS } = constants

export async function validatePartyURL(partyURL) {
  const response = await axios({
    method: 'get',
    url: `${BACKEND_ADDRESS}/parties/validatePartyURL?partyURL=${partyURL}`,
  })
  const partyURLIsValid = response.data

  return partyURLIsValid
}
