var util = require('util');
var ValidationError = require('../error');
var messages = require('../messages');

/**
 *  Helper for creating validation errors.
 *
 *  If a descriptor has a message property it takes
 *  precedence.
 *
 *  @param descriptor The validation rule descriptor.
 *  @param message A custom messaage for the error.
 */
var getErrorMessage = function(descriptor, message) {
  var err;
  var msg = descriptor.message || message
    || util.format(messages.default, descriptor.field);
  var err = new ValidationError(msg);
  err.field = descriptor.field;
  return err;
}

module.exports = getErrorMessage;
