var helper = require('../rule');

/**
 *  Validates a number is an integer.
 */
var integer = function(descriptor, value, callback, values) {
  var errors = [];
  helper.required(descriptor, value, values, errors);
  helper.type(descriptor, value, values, errors);
  helper.range(descriptor, value, values, errors);
  callback(errors);
}

module.exports = integer;
