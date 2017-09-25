'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

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

var _net = require('net');

var _net2 = _interopRequireDefault(_net);

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var GitTokenEventWatcherClient = function (_EventEmitter) {
  (0, _inherits3.default)(GitTokenEventWatcherClient, _EventEmitter);

  function GitTokenEventWatcherClient(_ref) {
    var watcherIpcPath = _ref.watcherIpcPath;
    (0, _classCallCheck3.default)(this, GitTokenEventWatcherClient);

    var _this = (0, _possibleConstructorReturn3.default)(this, (GitTokenEventWatcherClient.__proto__ || (0, _getPrototypeOf2.default)(GitTokenEventWatcherClient)).call(this));

    _this.watcherIpcPath = watcherIpcPath;
    _this.connect();
    return _this;
  }

  (0, _createClass3.default)(GitTokenEventWatcherClient, [{
    key: 'connect',
    value: function connect() {
      var _this2 = this;

      this.contractEventListener = _net2.default.connect(this.watcherIpcPath);
      this.contractEventListener.on('connect', function () {
        console.log('Connected to GitToken Contract Event Watcher');
      });

      this.contractEventListener.on('error', function () {
        console.log('Connection Error to GitToken Contract Event Watcher.');
        _this2.reconnect();
      });

      // Implement this as a custom handled method in the Socket Server
      // this.contractEventListener.on('data', (_msg) => {
      //   const msg = JSON.parse(_msg.toString('utf8'))
      //   console.log('Received msg: ', msg)
      // })

      this.contractEventListener.on('end', function () {
        console.log('Connection to GitToken Contract Event Watcher Closed.');
        _this2.reconnect();
      });
    }
  }, {
    key: 'reconnect',
    value: function reconnect() {
      var _this3 = this;

      console.log('Attempting to Reconnect GitToken Event Watcher in 15 seconds...');
      setTimeout(function () {
        console.log('Attempting to Reconnect.');
        _this3.connect();
      }, 1000 * 15);
    }
  }]);
  return GitTokenEventWatcherClient;
}(_events2.default);

exports.default = GitTokenEventWatcherClient;