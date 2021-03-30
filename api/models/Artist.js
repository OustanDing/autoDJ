const mongoose = require('mongoose')

const artistSchema = new mongoose.Schema({
  spotifyID: {
    type: String,
    required: true,
  },
  genres: {
    type: [String],
    default: [],
  },
})

const Artist = mongoose.model('artists', artistSchema)
module.exports = Artist
