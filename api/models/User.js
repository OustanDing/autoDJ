const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  displayName: String,
  spotifyID: String,
  spotifyURI: String,
  apiEndpoint: String,
  images: [Object],
  parties: {
    type: [String],
    default: [],
  },
  accessToken: String,
  refreshToken: String,
})

const User = mongoose.model('users', userSchema)
module.exports = User
