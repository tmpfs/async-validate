var util = require('util');
var ValidationError = require('./error');

/**
 *  Helper for creating validation errors.
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
