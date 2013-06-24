var helper = require('../rule');

/**
 *  Performs validation for regexp types.
 */
var regexp = function(rule, value, callback, values) {
  var errors = [];
  helper.required(rule, value, values, errors);
  helper.type(rule, value, values, errors);
  callback(errors);
}

module.exports = regexp;
