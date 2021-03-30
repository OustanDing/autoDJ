const User = require('../models/User')
const Party = require('../models/Party')

async function getCurrentMetrics() {
  const numUsers = await User.count()
  const numParties = await Party.count()
  const data = {
    numUsers,
    numParties,
  }
  return data
}

module.exports = {
  getCurrentMetrics,
}
