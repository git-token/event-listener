'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

exports.default = broadcastEvent;

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * [broadcastEvent description]
 * @param  {[type]} details [description]
 * @return [type]           [description]
 */
function broadcastEvent(details) {
  var _this = this;

  return new _bluebird2.default(function (resolve, reject) {
    _bluebird2.default.resolve((0, _keys2.default)(_this.connections)).map(function (id) {
      if (!_this.connections[id].destroyed) {
        _this.connections[id].write((0, _stringify2.default)(details));
      } else {
        delete _this.connections[id];
      }

      return null;
    }).then(function () {
      resolve(true);
    }).catch(function (error) {
      reject(error);
    });
  });
}