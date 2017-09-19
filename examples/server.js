const GitTokenContractEventListener = require('../dist/server/index').default
const config = require('../config')

const listener = new GitTokenContractEventListener(config)
