const { times, map } = require('lodash')
const serverUrl = 'http://localhost:3031'

const usersSignInData = times(7, num => ({
  email: `${num + 1}@example.com`,
  password: '12345'
}))


const main = async () => {
  console.log('START')
  const signInPromises = map(usersSignInData, async (user) => {
    const feathers = require('@feathersjs/feathers')
    const socketio = require('@feathersjs/socketio-client')
    const auth = require('@feathersjs/authentication-client')
    const io = require('socket.io-client')

    const socket = io(serverUrl, { transports: ['websocket']})
    const server = feathers()
      .configure(socketio(socket))
      .configure(auth({ timeout: 5000 }))

    try {
      const startTime = Date.now()
      await server.service('users').create(user)
      const totalTime = Date.now() - startTime
      return { ...user, totalTime }
    } catch (e) {
      return {...user, error: e.message }
    }
  })

  const res = await Promise.all(signInPromises)
  console.log(res)
  console.log('END')
}

main()
