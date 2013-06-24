var helper = require('../rule');

/**
 *  Validates a number is a floating point number.
 */
var float = function(rule, value, callback, source) {
  var errors = [];
  helper.required(rule, value, source, errors);
  helper.type(rule, value, source, errors);
  helper.range(rule, value, source, errors);
  callback(errors);
}

module.exports = float;
