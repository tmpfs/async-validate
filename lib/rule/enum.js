var util = require('util');
var error = require('./error');
var messages = require('../messages');

/**
 *  Rule for validating a value exists in an enumerable list.
 *
 *  @param rule The validation rule.
 *  @param value The value of the field on the source object.
 *  @param source The source object being validated.
 *  @param errors An array of errors that this rule may add
 *  validation errors to.
 */
var enumerable = function(rule, value, source, errors) {
  rule.enum = rule.enum || [];
  if(rule.enum.indexOf(value) == -1) {
    errors.push(error(rule,
      util.format(messages.enum, rule.field, rule.enum.join(', '))));
  }
}

module.exports = enumerable;
