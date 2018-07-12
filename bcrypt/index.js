const feathers = require('@feathersjs/feathers')
const express = require('@feathersjs/express')
const socketio = require('@feathersjs/socketio')
const authentication = require('@feathersjs/authentication')
const local = require('@thepesta/authentication-local')
const jwt = require('@feathersjs/authentication-jwt')
const { times } = require('lodash')

const memory = require('feathers-memory')

// Creates an Express compatible Feathers application
const app = express(feathers())

// Parse HTTP JSON bodies
app.use(express.json())
// Parse URL-encoded params
app.use(express.urlencoded({ extended: true }))
// Add REST API support
app.configure(express.rest())
// Configure Socket.io real-time APIs
app.configure(socketio())

app.configure(authentication({
  secret: '123'
}))

app.configure(local())
app.configure(jwt())


// Register a messages service with pagination
app.use('/messages', memory({
  paginate: {
    default: 10,
    max: 25
  }
}))


app.use('/users', memory())

const usersService = app.service('users')

usersService.hooks({
  before: {
    create: [
      local.hooks.hashPassword()
    ]
  }
})

//usersService.create(times(5, num => (
  //{
    //email: `${num + 1}@example.com`,
    //password: '12345'
  //}
//)))

app.service('authentication').hooks({
  before: {
    create: [
      authentication.hooks.authenticate(['local', 'jwt'])
    ]
  }
})

// Register a nicer error handler than the default Express one
app.use(express.errorHandler())

// Add any new real-time connection to the `everybody` channel
app.on('connection', connection => app.channel('everybody').join(connection))
// Publish all events to the `everybody` channel

const sleep = require('util').promisify(setTimeout)
app.listen(3031).on('listening', () => {
  console.log('Feathers server listening on localhost:3031')
  const moment = require('moment')
  const endlessPrintout = async () => {
    console.log(moment().format())
    await sleep(1000)
    endlessPrintout()
  }
  endlessPrintout()
})

require('blocked-at')((time, stack) => {
  console.log(`Blocked for ${time}ms, operation started here:`)
}, { threshold: 100 })
