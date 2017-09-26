'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _web = require('web3');

var _web2 = _interopRequireDefault(_web);

var _mysql = require('mysql');

var _mysql2 = _interopRequireDefault(_mysql);

var _index = require('./utils/index');

var _index2 = require('./sql/index');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _require = require('gittoken-contracts/build/contracts/GitToken.json'),
    abi = _require.abi,
    unlinked_binary = _require.unlinked_binary;

var net = (0, _bluebird.promisifyAll)(require('net'));

var GitTokenContractEventListener = function () {
  function GitTokenContractEventListener(_ref) {
    var _this = this;

    var mysqlHost = _ref.mysqlHost,
        mysqlUser = _ref.mysqlUser,
        mysqlRootPassword = _ref.mysqlRootPassword,
        mysqlDatabase = _ref.mysqlDatabase,
        web3Provider = _ref.web3Provider,
        ethereumIpcPath = _ref.ethereumIpcPath,
        watcherIpcPath = _ref.watcherIpcPath;
    (0, _classCallCheck3.default)(this, GitTokenContractEventListener);

    this.ethereumIpcPath = ethereumIpcPath;

    this.contracts = {};
    this.contractEvents = {};
    this.connections = {};

    this.handleEvent = _index.handleEvent.bind(this);
    this.broadcastEvent = _index.broadcastEvent.bind(this);
    this.insertIntoContributions = _index2.insertIntoContributions.bind(this);
    this.selectOrganizationFromRegistry = _index2.selectOrganizationFromRegistry.bind(this);

    if (web3Provider) {
      this.web3 = new _web2.default(new _web2.default.providers.HttpProvider(web3Provider));
    } else {
      this.web3 = new _web2.default(new _web2.default.providers.IpcProvider(ethereumIpcPath, net));
    }

    // Instantiate MySql Connection
    this.mysql = _mysql2.default.createConnection({
      host: mysqlHost,
      user: mysqlUser,
      password: mysqlRootPassword,
      database: mysqlDatabase
    });

    this.server = net.createServer(function (socket) {
      var id = new Date().getTime();
      _this.connections[id] = socket;
      _this.connections[id].on('data', function (msg) {
        var _JSON$parse = JSON.parse(msg.toString('utf8')),
            type = _JSON$parse.type,
            data = _JSON$parse.data;

        switch (type) {
          case 'WATCH_TOKEN':
            _this.watchToken((0, _extends3.default)({}, data));
            break;
          default:
            _this.connections[id].write((0, _stringify2.default)({
              type: 'error',
              message: 'Unknown event, ' + event
            }) + '\n');
        }
      });
    });

    this.server.listen({ path: watcherIpcPath }, function () {
      console.log('GitToken Contract Event Listener Listening at path: ', watcherIpcPath);
    });
  }

  (0, _createClass3.default)(GitTokenContractEventListener, [{
    key: 'watchToken',
    value: function watchToken(_ref2) {
      var _this2 = this;

      var organization = _ref2.organization,
          token = _ref2.token,
          socket = _ref2.socket;

      this.contracts[token] = this.web3.eth.contract(abi).at(token);
      this.contractEvents[token] = this.contracts[token].allEvents({ fromBlock: 0, toBlock: 'latest' });
      this.contractEvents[token].watch(function (error, result) {
        _this2.handleEvent({ data: result, organization: organization }).then(function (details) {
          return _this2.broadcastEvent(details);
        }).catch(function (error) {
          console.log('error', error);
        });
      });
    }
  }]);
  return GitTokenContractEventListener;
}();

exports.default = GitTokenContractEventListener;