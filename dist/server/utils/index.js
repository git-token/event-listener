'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.broadcastEvent = exports.handleEvent = undefined;

var _handleEvent = require('./handleEvent');

var _handleEvent2 = _interopRequireDefault(_handleEvent);

var _broadcastEvent = require('./broadcastEvent');

var _broadcastEvent2 = _interopRequireDefault(_broadcastEvent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.handleEvent = _handleEvent2.default;
exports.broadcastEvent = _broadcastEvent2.default;