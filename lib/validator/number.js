var helper = require('../rule');

/**
 *  Performs validation for number types.
 */
var number = function(descriptor, value, callback, values) {
  var errors = [];
  helper.required(descriptor, value, values, errors);
  helper.type(descriptor, value, values, errors);
  helper.length(descriptor, value, values, errors);
  callback(errors);
}

module.exports = number;
