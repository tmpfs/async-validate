var util = require('util');
var ValidationError = require('../error');
var messages = require('../messages');

/**
 *  Helper for creating validation errors.
 *
 *  If a rule has a message property it takes
 *  precedence.
 *
 *  @param rule The validation rule rule.
 *  @param message A custom messaage for the error.
 */
var getErrorMessage = function(rule, message) {
  var err;
  var msg = rule.message || message
    || util.format(messages.default, rule.field);
  var err = new ValidationError(msg);
  err.field = rule.field;
  return err;
}

module.exports = getErrorMessage;
