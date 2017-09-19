import net from 'net'

export default class GitTokenEventWatcherClient {
  constructor({ watcherIpcPath }) {
    this.watcherIpcPath = watcherIpcPath
    this.connect()
  }

  connect() {
    this.watcher = net.connect(this.watcherIpcPath)
    this.watcher.on('connect', () => {
      console.log('Connected to GitToken Contract Event Watcher')
    })

    this.watcher.on('error', () => {
      console.log('Connection Error to GitToken Contract Event Watcher.')
      this.reconnect()
    })

    this.watcher.on('end', () => {
      console.log('Connection to GitToken Contract Event Watcher Closed.')
      this.reconnect()
    })
  }

  reconnect() {
    console.log('Attempting to Reconnect in 15 seconds...')
    setTimeout(() => {
      console.log('Attempting to Reconnect.')
      this.connect()
    }, 1000 * 15)
  }
}
