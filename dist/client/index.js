'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _net = require('net');

var _net2 = _interopRequireDefault(_net);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var GitTokenEventWatcherClient = function () {
  function GitTokenEventWatcherClient(_ref) {
    var watcherIpcPath = _ref.watcherIpcPath;
    (0, _classCallCheck3.default)(this, GitTokenEventWatcherClient);

    this.watcherIpcPath = watcherIpcPath;
    this.connect();
  }

  (0, _createClass3.default)(GitTokenEventWatcherClient, [{
    key: 'connect',
    value: function connect() {
      var _this = this;

      this.watcher = _net2.default.connect(this.watcherIpcPath);
      this.watcher.on('connect', function () {
        console.log('Connected to GitToken Contract Event Watcher');
      });

      this.watcher.on('error', function () {
        console.log('Connection Error to GitToken Contract Event Watcher.');
        _this.reconnect();
      });

      this.watcher.on('end', function () {
        console.log('Connection to GitToken Contract Event Watcher Closed.');
        _this.reconnect();
      });
    }
  }, {
    key: 'reconnect',
    value: function reconnect() {
      var _this2 = this;

      console.log('Attempting to Reconnect in 15 seconds...');
      setTimeout(function () {
        console.log('Attempting to Reconnect.');
        _this2.connect();
      }, 1000 * 15);
    }
  }]);
  return GitTokenEventWatcherClient;
}();

exports.default = GitTokenEventWatcherClient;