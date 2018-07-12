const { times, map } = require('lodash')
const serverUrl = Number(process.env.BCRYPT) ? 'http://localhost:3032' : 'http://localhost:3031'
const numberOfUsers = process.env.NUMBER_OF_USERS || 5

const usersSignInData = times(numberOfUsers, num => ({
  email: `${num + 1}@example.com`,
  password: '12345'
}))

const main = async () => {
  console.log('START num of users: ', numberOfUsers)
  const signInPromises = map(usersSignInData, async (user) => {
    const feathers = require('@feathersjs/feathers')
    const socketio = require('@feathersjs/socketio-client')
    const auth = require('@feathersjs/authentication-client')
    const io = require('socket.io-client')

    const socket = io(serverUrl, { transports: ['websocket']})
    const client = feathers()
      .configure(socketio(socket))
      .configure(auth({ timeout: 5000 }))

    try {
      const startTime = Date.now()
      await client.service('users').create(user)
      const totalTime = `${Date.now() - startTime}`
      return { totalTime }
    } catch (e) {
      return { error: e.message }
    }
  })

  const fetchMessagePromise = () => {
    const feathers = require('@feathersjs/feathers')
    const socketio = require('@feathersjs/socketio-client')
    const auth = require('@feathersjs/authentication-client')
    const io = require('socket.io-client')

    const socket = io(serverUrl, { transports: ['websocket']})
    const client = feathers()
      .configure(socketio(socket))
      .configure(auth({ timeout: 5000 }))

    const startTime = Date.now()
    return client.service('messages').find()
      .then((res) => ({ query: 'FIND/messages', res, totalTime: `${Date.now() - startTime}ms` }))
  }

  const res = await Promise.all(signInPromises)

  const createCsvWriter = require('csv-writer').createObjectCsvWriter
  const writer = createCsvWriter({
    path: './results.csv',
    header: ['totalTime', 'error']
  })

  await writer.writeRecords(res)
  console.log('END')
}

main()
  .then(process.exit)
  .then(process.exit)
