var rules = require('../rule');

/**
 *  Validates an array.
 */
var array = function(rule, value, callback, source) {
  var errors = [];
  rules.required(rule, value, source, errors);
  rules.type(rule, value, source, errors);
  rules.range(rule, value, source, errors);
  callback(errors);
}

module.exports = array;
