var util = require('util');
var error = require('./error');
var messages = require('../messages');

/**
 *  Rule for validating required fields.
 *
 *  @param rule The validation rule.
 *  @param value The value of the field on the source object.
 *  @param source The source object being validated.
 *  @param errors An array of errors that this rule may add
 *  validation errors to.
 */
var required = function(rule, value, source, errors) {
  if(rule.required
     && !source.hasOwnProperty(rule.field)) {
    errors.push(error(rule,
      util.format(messages.required, rule.field)));
  }
}

module.exports = required;
