var rules = require('../rule');

/**
 *  Validates the regular expression type.
 *
 *  @param rule The validation rule.
 *  @param value The value of the field on the source object.
 *  @param callback The callback function.
 *  @param source The source object being validated.
 */
var regexp = function(rule, value, callback, source) {
  var errors = [];
  rules.required(rule, value, source, errors);
  rules.type(rule, value, source, errors);
  callback(errors);
}

module.exports = regexp;
