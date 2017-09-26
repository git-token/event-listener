import net from 'net'
import EventEmitter from 'events'

export default class GitTokenEventWatcherClient extends EventEmitter  {
  constructor({ watcherIpcPath }) {
    super()
    this.watcherIpcPath = watcherIpcPath
    this.connect()
  }

  connect() {
    this.eventListener = net.connect(this.watcherIpcPath)
    this.eventListener.on('connect', () => {
      console.log('Connected to GitToken Contract Event Watcher')
    })

    this.eventListener.on('error', () => {
      console.log('Connection Error to GitToken Contract Event Watcher.')
      this.reconnect()
    })

    // Implement this as a custom handled method in the Socket Server
    // this.eventListener.on('data', (_msg) => {
    //   const msg = JSON.parse(_msg.toString('utf8'))
    //   console.log('Received msg: ', msg)
    // })

    this.eventListener.on('end', () => {
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
