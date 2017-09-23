import Promise, { promisifyAll } from 'bluebird'
import Web3 from 'web3'
import mysql from 'mysql'

import {
  handleEvent,
  broadcastEvent
} from './utils/index'

import {
  insertIntoContributions,
  selectOrganizationFromRegistry
} from './sql/index'

const {
  abi,
  unlinked_binary
} = require('gittoken-contracts/build/contracts/GitToken.json')

const net = promisifyAll(require('net'))

export default class GitTokenContractEventListener{
  constructor({
    mysqlHost,
    mysqlUser,
    mysqlRootPassword,
    mysqlDatabase,
    ethereumIpcPath,
    watcherIpcPath
  }) {
    this.ethereumIpcPath = ethereumIpcPath

    this.contracts = {}
    this.contractEvents = {}
    this.connections = {}

    this.handleEvent                    = handleEvent.bind(this)
    this.broadcastEvent                 = broadcastEvent.bind(this)
    this.insertIntoContributions        = insertIntoContributions.bind(this)
    this.selectOrganizationFromRegistry = selectOrganizationFromRegistry.bind(this)


    this.web3 = new Web3(new Web3.providers.IpcProvider(ethereumIpcPath, net));

    // Instantiate MySql Connection
    this.mysql = mysql.createConnection({
      host: mysqlHost,
      user: mysqlUser,
      password: mysqlRootPassword,
      database: mysqlDatabase,
    })

    this.server = net.createServer((socket) => {
      const id = new Date().getTime()
      this.connections[id] = socket
      this.connections[id].on('data', (msg) => {
        const { event, data } = JSON.parse(msg.toString('utf8'))
        switch(event) {
          case 'watch_token':
            this.watchToken({ ...data })
            break;
          default:
            this.connections[id].write(JSON.stringify({
              event: 'error',
              message: `Unknown event, ${event}`
            }))
        }
      })
    })

    this.server.listen({ path: watcherIpcPath}, () => {
      console.log('GitToken Contract Event Listener Listening at path: ', watcherIpcPath)
    })

  }

  watchToken({ organization, token, socket }) {
    this.contracts[token] = this.web3.eth.contract(abi).at(token)
    this.contractEvents[token] = this.contracts[token].allEvents({ fromBlock: 0, toBlock: 'latest' });
    this.contractEvents[token].watch((error, result) => {
      this.handleEvent({ data: result, organization })
        .then((details) => { return this.broadcastEvent(details) })
        .catch((error) => { console.log('error', error) })
    })
  }


}
