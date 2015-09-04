/**
 *  Encapsulates a validation error.
 */
function ValidationError(msg) {
  Error.call(this);
  //if(!(this instanceof ValidationError)) {
    //return new ValidationError(msg); 
  //}
  this.message = msg || this.name;
}

ValidationError.prototype = new Error();
ValidationError.prototype.name = 'ValidationError';

module.exports = ValidationError;
