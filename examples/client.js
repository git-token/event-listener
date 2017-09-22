const Promise = require('bluebird')
const Client = require('../dist/client/index').default
const config = require('../config')

const client = new Client(config)


Promise.resolve().then(() => {
  client.socket.write(JSON.stringify({
    event: 'watch_token',
    data: {
      organization: 'git-token',
      token: '0x03c7529e1cae28d8acf25964fde82578e6347186'
    }
  }))
  return Promise.delay(1000)
}).then(() => {
  client.socket.write(JSON.stringify({
    event: 'watch_token',
    data: {
      organization: 'economic-network',
      token: '0xcaecd5920238e5b0c78d9e47e162c25783adf510'
    }
  }))
})
