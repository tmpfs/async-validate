var util = require('util');
var ValidationError = require('./error');

var messages = {
  default: 'Validation error on field %s',
  required: 'Field %s is required',
  type: 'Field %s is not a %s',
  string: {
    min: 'Field %s must be at least %s characters'
  }
}

var getErrorMessage = function(descriptor, message) {
  var err;
  var msg = descriptor.message || message
    || util.format(messages.default, descriptor.field);
  var err = new ValidationError(msg);
  err.field = descriptor.field;
  return err;
}

var required = function(descriptor, value, values, errors) {
  //console.log("testing required field...");
  if(descriptor.required && !values.hasOwnProperty(descriptor.field)) {
    errors.push(getErrorMessage(descriptor,
      util.format(messages.required, descriptor.field)));
  }
}

var type = function(descriptor, value, values, errors) {
  //console.log("checking type %s : %s", descriptor.type, typeof(value));
  if(descriptor.type
     && !(typeof(value) == descriptor.type)) {
    // if value is required and value is undefined
    // no need  to add this error message
    if(!descriptor.required && value != undefined ) {
      errors.push(getErrorMessage(descriptor,
        util.format(messages.type, descriptor.field, descriptor.type)));
    }
  }
}

var strlen = function(descriptor, value, values, errors) {
  if(typeof descriptor.min == 'number'
    && typeof(value) == 'string'
    && value.length < descriptor.min ) {
      errors.push(getErrorMessage(descriptor,
        util.format(messages.string.min, descriptor.field, descriptor.min)));
  }
}

// validators
var string = function(descriptor, value, callback, values) {
  var errors = [];
  required(descriptor, value, values, errors);
  type(descriptor, value, values, errors);
  strlen(descriptor, value, values, errors);
  //console.log("String validation length %s", errors.length);
  callback(errors);
}

var validators = module.exports = {
  string: string
}

module.exports.messages = messages;
