import Promise, { promisifyAll } from 'bluebird'
import Web3 from 'web3'
import mysql from 'mysql'
import split from 'split'

const fs = promisifyAll(require('fs'))

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
    this.watcherIpcPath  = watcherIpcPath

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
      this.connections[id].on('data', (msg) => {
        console.log(`Incoming Message: ${msg.toString('utf8')}\n\n\n`)
        const { type, data } = JSON.parse(msg.toString('utf8'))
        switch(type) {
          case 'WATCH_TOKEN':
            this.watchToken({ ...data })
            break;
          default:
            this.connections[id].write(`${JSON.stringify({
              type: 'error',
              message: `Unknown event, ${type}`
            })}\n`)
        }
      })
    })

    // Remove the existing IPC path if exists, then listen for events
    fs.unlinkAsync(this.watcherIpcPath).then(() => {
      this.listen()
    }).catch((error) => {
      if (error.code == 'ENOENT') {
        this.listen()
      }
    })

  }

  listen() {
    this.server.listen({ path: this.watcherIpcPath }, () => {
      console.log(`GitToken Contract Event Listener Listening at path: ${this.watcherIpcPath}\n\n\n`)
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
