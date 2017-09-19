"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = insertIntoContributions;

var _bluebird = require("bluebird");

var _bluebird2 = _interopRequireDefault(_bluebird);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * [insertIntoContribution description]
 * @param  {String} [transactionHash=""] [description]
 * @param  {String} [contributor=""]     [description]
 * @param  {String} [username=""]        [description]
 * @param  {Number} [value=0]            [description]
 * @param  {Number} [reservedValue=0]    [description]
 * @param  {Number} [date=0]             [description]
 * @param  {String} [rewardType=""]      [description]
 * @param  {String} [reservedType=""}]   [description]
 * @return [type]                        [description]
 */
function insertIntoContributions(_ref) {
  var _this = this;

  var _ref$transactionHash = _ref.transactionHash,
      transactionHash = _ref$transactionHash === undefined ? "" : _ref$transactionHash,
      _ref$contributor = _ref.contributor,
      contributor = _ref$contributor === undefined ? "" : _ref$contributor,
      _ref$username = _ref.username,
      username = _ref$username === undefined ? "" : _ref$username,
      _ref$value = _ref.value,
      value = _ref$value === undefined ? 0 : _ref$value,
      _ref$reservedValue = _ref.reservedValue,
      reservedValue = _ref$reservedValue === undefined ? 0 : _ref$reservedValue,
      _ref$date = _ref.date,
      date = _ref$date === undefined ? 0 : _ref$date,
      _ref$rewardType = _ref.rewardType,
      rewardType = _ref$rewardType === undefined ? "" : _ref$rewardType,
      _ref$reservedType = _ref.reservedType,
      reservedType = _ref$reservedType === undefined ? "" : _ref$reservedType,
      _ref$organization = _ref.organization,
      organization = _ref$organization === undefined ? "" : _ref$organization;

  return new _bluebird2.default(function (resolve, reject) {
    _this.mysql.query("\n      INSERT INTO contributions (\n        txHash,\n        contributor,\n        username,\n        value,\n        reservedValue,\n        date,\n        rewardType,\n        organization\n      ) VALUES (\n        \"" + transactionHash + "\",\n        \"" + contributor + "\",\n        \"" + username + "\",\n        " + value.toNumber() + ",\n        " + reservedValue.toNumber() + ",\n        " + date.toNumber() + ",\n        \"" + rewardType + "\",\n        \"" + organization + "\"\n      );\n    ", function (error, result) {
      if (error) {
        console.log(error);
      }
      resolve(result);
    });
  });
}