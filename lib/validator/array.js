var helper = require('../rule');

/**
 *  Validates an array.
 */
var array = function(rule, value, callback, source) {
  var errors = [];
  helper.required(rule, value, source, errors);
  helper.type(rule, value, source, errors);
  helper.range(rule, value, source, errors);
  callback(errors);
}

module.exports = array;
