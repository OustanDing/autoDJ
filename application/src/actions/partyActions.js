export const createParty = () => {
  return {
    type: 'CREATE_PARTY',
  }
}

export const joinParty = () => {
  return {
    type: 'JOIN_PARTY',
  }
}

export const connectedToParty = (partyData) => {
  return {
    type: 'CONNECTED_TO_PARTY',
    partyData,
  }
}
