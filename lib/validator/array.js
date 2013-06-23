var helper = require('../rule');

/**
 *  Validates an array.
 */
var array = function(rule, value, callback, values) {
  var errors = [];
  helper.required(rule, value, values, errors);
  helper.type(rule, value, values, errors);
  helper.range(rule, value, values, errors);
  callback(errors);
}

module.exports = array;
