var rules = require('../rule');

/**
 *  Performs validation for string types.
 *
 *  @param rule The validation rule.
 *  @param value The value of the field on the source object.
 *  @param callback The callback function.
 *  @param source The source object being validated.
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
