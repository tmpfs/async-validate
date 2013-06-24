var rules = require('../rule');

/**
 *  Performs validation for boolean types.
 */
var boolean = function(rule, value, callback, source) {
  var errors = [];
  rules.required(rule, value, source, errors);
  rules.type(rule, value, source, errors);
  callback(errors);
}

module.exports = boolean;
