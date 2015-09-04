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
function date(rule, value, callback, source, options) {
  var errors = [];
  var validate = rule.required
    || (!rule.required && source.hasOwnProperty(rule.field) && source[rule.field]);
  if(validate) {
    //console.log("Validating date %s with value: %s", rule.field, value);
    if(value === undefined && !rule.required) return callback();
    rules.required(rule, value, source, errors, options);
    rules.pattern(rule, value, source, errors, options);
    rules.date(rule, value, source, errors, options);
  }
  callback(errors);
}

module.exports = date;
