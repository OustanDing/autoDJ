const axios = require('axios')
const { getPartyInfo } = require('./parties/utils')

const CONNECT = 'connection'
const UPDATED_PARTY = 'updatedParty'
const UPDATED_PARTY_DATA = 'updatedPartyData'
const DISCONNECT = 'disconnect'

module.exports = (io) => {
  io.on(CONNECT, (socket) => {
    console.log(`User connected to room`)

    socket.on(UPDATED_PARTY, async ({ playlistID }) => {
      console.log(`Updated party. playlistID: ${playlistID}`)
      socket.join(playlistID)

      const updatedPartyInfo = await getPartyInfo(playlistID)

      socket.to(playlistID).emit(UPDATED_PARTY_DATA, updatedPartyInfo)
      socket.emit(UPDATED_PARTY_DATA, updatedPartyInfo)
    })

    socket.on(DISCONNECT, () => {
      console.log('User disconnected from room')
    })
  })
}
