const Client = require('../dist/client/index').default
const config = require('../config')

const client = new Client(config)


client.watcher.write(JSON.stringify({
  event: 'watch_token',
  data: {
    organization: 'git-token',
    token: '0x46d644d639581e9e0ab79681155fd848949f66a4'
  }
}))
