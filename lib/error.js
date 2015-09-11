/**
 *  Encapsulates a validation error.
 */
function ValidationError(msg) {
  this.name = ValidationError.name;
  Error.call(this);
  this.message = msg;
}

ValidationError.prototype = new Error();
ValidationError.prototype.name = 'ValidationError';

module.exports = ValidationError;
