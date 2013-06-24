var rules = require('../rule');

/**
 *  Validates a date against the format property.
 *
 *  @param rule The validation rule.
 *  @param value The value of the field on the source object.
 *  @param callback The callback function.
 *  @param source The source object being validated.
 *  @param options The validation options.
 *  @param options.messages The validation messages.
 */
var date = function(rule, value, callback, source, options) {
  var errors = [];
  rules.required(rule, value, source, errors, options);
  rules.pattern(rule, value, source, errors, options);
  rules.date(rule, value, source, errors, options);
  callback(errors);
}

module.exports = date;
