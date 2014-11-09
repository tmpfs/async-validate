var util = require('util');

/**
 *  Encapsulates a validation error.
 */
var ValidationError = module.exports = function (msg) {
  this.message = msg || this.name;
};

util.inherits(ValidationError, Error);

ValidationError.prototype.name = 'ValidationError';
