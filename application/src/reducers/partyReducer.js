const defaultState = {
  isHost: false,
  partyData: {
    members: [],
    playlistName: '',
    playlistID: '',
    genres: [],
    maxDuration: 0,
    duration: 0,
    songs: [],
  },
}

function partyReducer(state = defaultState, action) {
  switch (action.type) {
    case 'CREATE_PARTY':
      return {
        ...state,
        isHost: true,
      }
    case 'JOIN_PARTY':
      return {
        ...state,
        isHost: false,
      }
    case 'CONNECTED_TO_PARTY':
      return {
        ...state,
        partyData: {
          ...state.partyData,
          ...action.partyData,
        },
      }
    default:
      return state
  }
}

export default partyReducer
