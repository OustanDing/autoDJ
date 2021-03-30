const mongoose = require('mongoose')

const MONGOOSE_CONFIG = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
}

const DEV_CONFIG = {
  BACKEND_ADDRESS: 'http://localhost:3000',
  FRONTEND_ADDRESS: 'http://localhost:3001',
  SPOTIFY_CLIENT_ID: process.env.SPOTIFY_CLIENT_ID,
  SPOTIFY_CLIENT_SECRET: process.env.SPOTIFY_CLIENT_SECRET,
  connect() {
    mongoose
      .connect('mongodb://db:27017/autoDJ', MONGOOSE_CONFIG)
      .then(() => console.log('Database connected'))
      .catch((err) => console.log(`Failed to connect to database. ${err}`))
  },
}

const PROD_CONFIG = {
  BACKEND_ADDRESS: process.env.BACKEND_ADDRESS,
  FRONTEND_ADDRESS: process.env.FRONTEND_ADDRESS,
  SPOTIFY_CLIENT_ID: process.env.SPOTIFY_CLIENT_ID,
  SPOTIFY_CLIENT_SECRET: process.env.SPOTIFY_CLIENT_SECRET,
  connect() {
    mongoose
      .connect(process.env.DATABASE_URI, MONGOOSE_CONFIG)
      .then(() => console.log('Database connected'))
      .catch((err) => console.log(`Failed to connect to database. ${err}`))
  },
}

module.exports =
  process.env.NODE_ENV === 'development' ? DEV_CONFIG : PROD_CONFIG
