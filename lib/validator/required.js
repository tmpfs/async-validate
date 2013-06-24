var util = require('util');
var rules = require('../rule');
var messages = require('../messages');
var error = rules.error;

/**
 *  Validator used to add an error when a deep property is required
 *  and the corresponding property does not exist.
 *
 *  @param rule The validation rule.
 *  @param value The value of the field on the source object.
 *  @param callback The callback function.
 *  @param source The source object being validated.
 */
var required = function(rule, value, callback, source) {
  var errors = [];
  errors.push(
    error(rule, util.format(messages.required, rule.field)));
  callback(errors);
}

module.exports = required;
