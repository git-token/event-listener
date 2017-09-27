import Promise, { promisifyAll } from 'bluebird'
import Web3 from 'web3'
import mysql from 'mysql'
import split from 'split'

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
    web3Provider,
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

    if (web3Provider) {
      this.web3 = new Web3(new Web3.providers.HttpProvider(web3Provider));
    } else {
      this.web3 = new Web3(new Web3.providers.IpcProvider(ethereumIpcPath, net));
    }


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
      this.connections[id].pipe(split(JSON.parse)).on('data', (msg) => {
        console.log(`Incoming Message: ${msg}\n\n\n`)
        const { type, data } = msg
        switch(type) {
          case 'WATCH_TOKEN':
            this.watchToken({ ...data })
            break;
          default:
            this.connections[id].write(`${JSON.stringify({
              type: 'error',
              message: `Unknown event, ${event}`
            })}\n`)
        }
      })
    })

    this.server.listen({ path: watcherIpcPath}, () => {
      console.log(`GitToken Contract Event Listener Listening at path: ${watcherIpcPath}\n\n\n`)
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
