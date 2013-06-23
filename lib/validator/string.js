var helper = require('../rule');

/**
 *  Performs validation for string types.
 */
var string = function(descriptor, value, callback, values) {
  var errors = [];
  helper.required(descriptor, value, values, errors);
  helper.type(descriptor, value, values, errors);
  helper.strlen(descriptor, value, values, errors);
  helper.pattern(descriptor, value, values, errors);
  callback(errors);
}

module.exports = string;
