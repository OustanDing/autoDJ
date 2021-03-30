require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const http = require('http')
const socketio = require('socket.io')

const socket = require('./socket')
const { FRONTEND_ADDRESS, connect } = require('./config')

const app = express()
const PORT = process.env.PORT || 3000
const server = http.createServer(app)
const io = socketio(server, {
  cors: {
    origin: FRONTEND_ADDRESS,
    methods: ['GET', 'POST'],
  },
})

const auth = require('./auth/routes')
const users = require('./users/routes')
const metrics = require('./metrics/routes')
const parties = require('./parties/routes')

app.use(
  cors({
    origin: FRONTEND_ADDRESS,
    credentials: true,
  }),
)
app.use(bodyParser.json())
app.use((req, res, next) => {
  res.set({
    'Access-Control-Allow-Origin': FRONTEND_ADDRESS,
    'Access-Control-Allow-Headers':
      'Origin, X-Requested-With, Content-Type, Accept, Authorization, authentication',
    'Access-Control-Allow-Methods': 'GET, PUT, PATCH, POST, DELETE, OPTIONS',
    'Access-Control-Allow-Credentials': true,
  })
  next()
})
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`)
  next()
})

app.use('/auth', auth)
app.use('/users', users)
app.use('/metrics', metrics)
app.use('/parties', parties)

app.get('/', (req, res) => {
  res.status(200).send('Connected to autoDJ')
})

connect()

server.listen(PORT, () => {
  console.log(`autoDJ is running on port ${PORT}`)
})

socket(io)
