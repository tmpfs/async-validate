var rules = require('../rule');

/**
 *  Performs validation for string types.
 */
var string = function(rule, value, callback, source) {
  var errors = [];
  rules.required(rule, value, source, errors);
  rules.type(rule, value, source, errors);
  rules.range(rule, value, source, errors);
  rules.pattern(rule, value, source, errors);
  if(rule.whitespace === true) {
    rules.whitespace(rule, value, source, errors);
  }
  callback(errors);
}

module.exports = string;
