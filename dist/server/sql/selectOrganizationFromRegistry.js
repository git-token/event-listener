"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = selectOrganizationFromRegistry;

var _bluebird = require("bluebird");

var _bluebird2 = _interopRequireDefault(_bluebird);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * [selectOrganizationFromRegistry description]
 * @param  {String} [token="" }]            [description]
 * @return [type]             [description]
 */
function selectOrganizationFromRegistry(_ref) {
  var _this = this;

  var _ref$token = _ref.token,
      token = _ref$token === undefined ? "" : _ref$token;

  return new _bluebird2.default(function (resolve, reject) {
    _this.mysql.query("\n      SELECT organization\n      FROM registry\n      WHERE token_address=\"" + token + "\";\n    ", function (error, result) {
      if (error) {
        reject(error);
      }
      resolve(result[0].organization);
    });
  });
}