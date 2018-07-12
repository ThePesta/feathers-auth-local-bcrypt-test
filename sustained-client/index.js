const { times, map } = require('lodash')
const serverUrl = Number(process.env.BCRYPT) ? 'http://localhost:3032' : 'http://localhost:3031'
console.log(serverUrl)
const requestPerSecond = process.env.REQUESTS_PER_SECOND || 5
const maxRuntime = process.env.DURATION ? Number(process.env.DURATION) * 1000 : 30000
const sleep = require('util').promisify(setTimeout)
const timeBetweenRequests = 1000 / requestPerSecond
const moment = require('moment')

const usersSignInData = times(requestPerSecond * (maxRuntime / 1000), num => ({
  email: `${num + 1}@example.com`,
  password: '12345'
}))

const main = async () => {
  console.log('START sustained requests per second: ', requestPerSecond, ', duration: ', `${maxRuntime / 1000}seconds`)
  const signInPromises = map(usersSignInData, async (user, index) => {
    const feathers = require('@feathersjs/feathers')
    const socketio = require('@feathersjs/socketio-client')
    const auth = require('@feathersjs/authentication-client')
    const io = require('socket.io-client')

    const socket = io(serverUrl, { transports: ['websocket']})
    const client = feathers()
      .configure(socketio(socket))
      .configure(auth({ timeout: 5000 }))

    let requestTime
    try {
      const waitTime = index * timeBetweenRequests
      await sleep(waitTime)
      //requestTime = moment().format('HH:MM:ss:SSS')
      //const nowTime = new Date()
      //requestTime = `${nowTime.getHours()}:${nowTime.getMinutes()}:${nowTime.getSeconds()}:${nowTime.getMilliseconds()}`
      requestTime = waitTime / 1000
      const startTime = Date.now()
      await client.service('users').create(user)
      const totalTime = `${Date.now() - startTime}`
      return { totalTime, requestTime }
    } catch (e) {
      return { requestTime, error: e.message }
    }
  })

  const res = await Promise.all(signInPromises)

  const createCsvWriter = require('csv-writer').createObjectCsvWriter
  const writer = createCsvWriter({
    path: './results.csv',
    header: ['requestTime', 'totalTime', 'error']
  })

  await writer.writeRecords(res)
  console.log('END')
}

main()
  .then(process.exit)
