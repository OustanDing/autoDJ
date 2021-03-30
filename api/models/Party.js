const mongoose = require('mongoose')

const partySchema = new mongoose.Schema({
  members: [mongoose.Schema.Types.ObjectId],
  host: mongoose.Schema.Types.ObjectId,
  playlistName: String,
  playlistID: String,
  genres: {
    type: [String],
    default: [],
    required: false,
  },
  maxDuration: {
    type: Number,
    default: 0,
  },
  duration: {
    type: Number,
    default: 0,
  },
})

const Party = mongoose.model('parties', partySchema)
module.exports = Party
