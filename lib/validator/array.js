var rules = require('../rule');

/**
 *  Validates an array.
 *
 *  @param rule The validation rule.
 *  @param value The value of the field on the source object.
 *  @param callback The callback function.
 *  @param source The source object being validated.
 */
var array = function(rule, value, callback, source) {
  var errors = [];
  rules.required(rule, value, source, errors);
  if(rule.required || value != undefined) {
    rules.type(rule, value, source, errors);
    rules.range(rule, value, source, errors);
  }
  callback(errors);
}

module.exports = array;
