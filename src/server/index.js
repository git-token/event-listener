import Promise from 'bluebird'
import EventEmitter from 'events'
import net from 'net'
import Web3 from 'web3'
import mysql from 'mysql'

import handleEvent from './handleEvent'

import {
  insertIntoContributions,
  selectOrganizationFromRegistry
} from './sql/index'

const {
  abi,
  unlinked_binary
} = require('gittoken-contracts/build/contracts/GitToken.json')

export default class GitTokenContractEventListener extends EventEmitter {
  constructor({
    mysqlHost,
    mysqlUser,
    mysqlRootPassword,
    mysqlDatabase,
    ethereumIpcPath,
    watcherIpcPath
  }) {
    super()
    this.ethereumIpcPath = ethereumIpcPath

    this.contracts = {}
    this.contractEvents = {}

    this.handleEvent                    = handleEvent.bind(this)
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
      this.socket = socket;
      this.socket.on('data', (msg) => {
        console.log('msg', msg)
        const { event, data } = JSON.parse(msg)
        switch(event) {
          case 'watch_token':
            this.watchToken({ ...data })
          default:
            this.socket.write(JSON.stringify({
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

  watchToken({ organization, token }) {
    this.contracts[token] = this.web3.eth.contract(abi).at(token)
    this.contractEvents[token] = this.contracts[token].allEvents({ fromBlock: 0, toBlock: 'latest' });
    this.contractEvents[token].watch((error, result) => {
      this.handleEvent({
          data: result,
          organization
      }).then((data) => {
        console.log('data', data)
      }).catch((error) => {
        console.log('error', error)
      })
    })
  }


}
