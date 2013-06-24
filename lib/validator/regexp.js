var helper = require('../rule');

/**
 *  Performs validation for regexp types.
 */
var regexp = function(rule, value, callback, source) {
  var errors = [];
  helper.required(rule, value, source, errors);
  helper.type(rule, value, source, errors);
  callback(errors);
}

module.exports = regexp;
