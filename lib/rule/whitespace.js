var util = require('util');
var error = require('./error');
var messages = require('../messages');

/**
 *  Rule for validating whitespace.
 *
 *  @param rule The validation rule.
 *  @param value The value of the field on the source object.
 *  @param source The source object being validated.
 *  @param errors An array of errors that this rule may add
 *  validation errors to.
 */
var whitespace = function(rule, value, source, errors) {
  if(/^\s+$/) {
    errors.push(error(rule,
      util.format(messages.whitespace, rule.field)));
  }
}

module.exports = whitespace;
