var rules = require('../rule');

/**
 *  Validates a number is an integer.
 */
var integer = function(rule, value, callback, source) {
  var errors = [];
  rules.required(rule, value, source, errors);
  rules.type(rule, value, source, errors);
  rules.range(rule, value, source, errors);
  callback(errors);
}

module.exports = integer;
