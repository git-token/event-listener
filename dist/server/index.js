'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

var _net = require('net');

var _net2 = _interopRequireDefault(_net);

var _web = require('web3');

var _web2 = _interopRequireDefault(_web);

var _mysql = require('mysql');

var _mysql2 = _interopRequireDefault(_mysql);

var _handleEvent = require('./handleEvent');

var _handleEvent2 = _interopRequireDefault(_handleEvent);

var _index = require('./sql/index');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _require = require('gittoken-contracts/build/contracts/GitToken.json'),
    abi = _require.abi,
    unlinked_binary = _require.unlinked_binary;

var GitTokenContractEventListener = function (_EventEmitter) {
  (0, _inherits3.default)(GitTokenContractEventListener, _EventEmitter);

  function GitTokenContractEventListener(_ref) {
    var mysqlHost = _ref.mysqlHost,
        mysqlUser = _ref.mysqlUser,
        mysqlRootPassword = _ref.mysqlRootPassword,
        mysqlDatabase = _ref.mysqlDatabase,
        ethereumIpcPath = _ref.ethereumIpcPath,
        watcherIpcPath = _ref.watcherIpcPath;
    (0, _classCallCheck3.default)(this, GitTokenContractEventListener);

    var _this = (0, _possibleConstructorReturn3.default)(this, (GitTokenContractEventListener.__proto__ || (0, _getPrototypeOf2.default)(GitTokenContractEventListener)).call(this));

    _this.ethereumIpcPath = ethereumIpcPath;

    _this.contracts = {};
    _this.contractEvents = {};

    _this.handleEvent = _handleEvent2.default.bind(_this);
    _this.insertIntoContributions = _index.insertIntoContributions.bind(_this);
    _this.selectOrganizationFromRegistry = _index.selectOrganizationFromRegistry.bind(_this);

    _this.web3 = new _web2.default(new _web2.default.providers.IpcProvider(ethereumIpcPath, _net2.default));

    // Instantiate MySql Connection
    _this.mysql = _mysql2.default.createConnection({
      host: mysqlHost,
      user: mysqlUser,
      password: mysqlRootPassword,
      database: mysqlDatabase
    });

    _this.server = _net2.default.createServer(function (socket) {
      _this.socket = socket;
      _this.socket.on('data', function (msg) {
        console.log('msg', msg);

        var _JSON$parse = JSON.parse(msg),
            event = _JSON$parse.event,
            data = _JSON$parse.data;

        switch (event) {
          case 'watch_token':
            _this.watchToken((0, _extends3.default)({}, data));
          default:
            _this.socket.write((0, _stringify2.default)({
              event: 'error',
              message: 'Unknown event, ' + event
            }));
        }
      });
    });

    _this.server.listen({ path: watcherIpcPath }, function () {
      console.log('GitToken Contract Event Listener Listening at path: ', watcherIpcPath);
    });

    return _this;
  }

  (0, _createClass3.default)(GitTokenContractEventListener, [{
    key: 'watchToken',
    value: function watchToken(_ref2) {
      var _this2 = this;

      var organization = _ref2.organization,
          token = _ref2.token;

      this.contracts[token] = this.web3.eth.contract(abi).at(token);
      this.contractEvents[token] = this.contracts[token].allEvents({ fromBlock: 0, toBlock: 'latest' });
      this.contractEvents[token].watch(function (error, result) {
        _this2.handleEvent({
          data: result,
          organization: organization
        }).then(function (data) {
          console.log('data', data);
        }).catch(function (error) {
          console.log('error', error);
        });
      });
    }
  }]);
  return GitTokenContractEventListener;
}(_events2.default);

exports.default = GitTokenContractEventListener;