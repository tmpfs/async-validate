/**
 *  Encapsulates a validation error.
 */
function ValidationError(msg) {
  this.message = msg || this.name;
}

ValidationError.prototype = new Error();
ValidationError.prototype.name = 'ValidationError';

module.exports = ValidationError;
