import net from 'net'
import EventEmitter from 'events'

export default class GitTokenEventWatcherClient extends EventEmitter  {
  constructor({ watcherIpcPath }) {
    super()
    this.watcherIpcPath = watcherIpcPath
    this.connect()
  }

  connect() {
    this.socket = net.connect(this.watcherIpcPath)
    this.socket.on('connect', () => {
      console.log('Connected to GitToken Contract Event Watcher')
    })

    this.socket.on('error', () => {
      console.log('Connection Error to GitToken Contract Event Watcher.')
      this.reconnect()
    })

    this.socket.on('data', (_msg) => {
      const msg = JSON.parse(_msg.toString('utf8'))
      console.log('Received msg: ', msg)
    })

    this.socket.on('end', () => {
      console.log('Connection to GitToken Contract Event Watcher Closed.')
      this.reconnect()
    })
  }

  reconnect() {
    console.log('Attempting to Reconnect GitToken Event Watcher in 15 seconds...')
    setTimeout(() => {
      console.log('Attempting to Reconnect.')
      this.connect()
    }, 1000 * 15)
  }
}
