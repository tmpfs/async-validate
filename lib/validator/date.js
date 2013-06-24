var rules = require('../rule');

/**
 *  Validates a date against the format property.
 *
 *  @param rule The validation rule.
 *  @param value The value of the field on the source object.
 *  @param callback The callback function.
 *  @param source The source object being validated.
 */
var date = function(rule, value, callback, source) {
  var errors = [];
  rules.required(rule, value, source, errors);
  rules.pattern(rule, value, source, errors);
  rules.date(rule, value, source, errors);
  callback(errors);
}

module.exports = date;
