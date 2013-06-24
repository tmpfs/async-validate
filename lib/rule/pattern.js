var util = require('util');
var error = require('./error');
var messages = require('../messages');

/**
 *  Rule for validating a regular expression pattern.
 *
 *  @param rule The validation rule.
 *  @param value The value of the field on the source object.
 *  @param source The source object being validated.
 *  @param errors An array of errors that this rule may add
 *  validation errors to.
 */
var pattern = function(rule, value, source, errors) {
  if(rule.pattern instanceof RegExp) {
    if(!rule.pattern.test(value)) {
      errors.push(error(rule,
        util.format(messages.pattern.mismatch,
          rule.field, value, rule.pattern)));
    }
  }
}

module.exports = pattern;
