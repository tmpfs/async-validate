var util = require('util');

/**
 *  Encapsulates a validation error.
 */
var ValidationError = module.exports = function(msg, constr) {
  Error.captureStackTrace(this, constr || this)
  this.message = msg || this.name;
}

util.inherits(ValidationError, Error);

ValidationError.prototype.name = 'ValidationError';
