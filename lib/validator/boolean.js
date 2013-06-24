var rules = require('../rule');

/**
 *  Validates a boolean.
 *
 *  @param rule The validation rule.
 *  @param value The value of the field on the source object.
 *  @param callback The callback function.
 *  @param source The source object being validated.
 *  @param options The validation options.
 *  @param options.messages The validation messages.
 */
var boolean = function(rule, value, callback, source, options) {
  var errors = [];
  rules.required(rule, value, source, errors, options);
  rules.type(rule, value, source, errors, options);
  callback(errors);
}

module.exports = boolean;
