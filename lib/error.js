var util = require('util');

var ValidationError = module.exports = function(msg, constr) {
  Error.captureStackTrace(this, constr || this)
  this.message = msg || this.name;
  //console.log(this.stack);
}

util.inherits(ValidationError, Error);

ValidationError.prototype.name = 'ValidationError';
