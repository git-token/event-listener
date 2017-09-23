'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

exports.default = handleEvent;

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * [handleEvent description]
 * @param  {[type]} data        [description]
 * @param  {[type]} organization [description]
 * @return [type]               [description]
 */
function handleEvent(_ref) {
  var _this = this;

  var data = _ref.data,
      organization = _ref.organization;

  return new _bluebird2.default(function (resolve, reject) {
    var event = data.event,
        args = data.args,
        transactionHash = data.transactionHash;

    try {
      switch (event) {
        case 'Contribution':
          _this.insertIntoContributions((0, _extends3.default)({}, args, { transactionHash: transactionHash, organization: organization })).then(function (result) {
            resolve({ event: event, data: result });
          }).catch(function (error) {
            reject(error);
          });
          break;
        default:
          resolve(data);
      }
    } catch (error) {
      reject(error);
    }
  });
}