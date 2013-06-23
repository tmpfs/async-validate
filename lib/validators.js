var util = require('util');
var ValidationError = require('./error');
var messages = require('./messages');


// helpers
var helper = require('./helper');

var getErrorMessage = helper.error;
var required = helper.required;

var type = function(descriptor, value, values, errors) {
  // if value is required and value is undefined
  // no need  to add this error message
  if(descriptor.type
     && !(typeof(value) == descriptor.type)) {
    if(!descriptor.required && value != undefined ) {
      errors.push(getErrorMessage(descriptor,
        util.format(messages.type, descriptor.field, descriptor.type)));
    }
  }
}

var strlen = function(descriptor, value, values, errors) {
  var min = typeof descriptor.min == 'number';
  var max = typeof descriptor.max == 'number';
  if( min && !max && typeof(value) == 'string'
    && value.length < descriptor.min ) {
      errors.push(getErrorMessage(descriptor,
        util.format(messages.string.min, descriptor.field, descriptor.min)));
  }
  if( max && !min && typeof(value) == 'string'
    && value.length > descriptor.max ) {
      errors.push(getErrorMessage(descriptor,
        util.format(messages.string.max, descriptor.field, descriptor.max)));
  }
  if(min && max && typeof(value) == 'string'
    && (value.length < min || value.length > max) ) {
      errors.push(getErrorMessage(descriptor,
        util.format(messages.string.range,
          descriptor.field, descriptor.min, descriptor.max)));
  }
}

var ptn = function(descriptor, value, values, errors) {
  if(descriptor.pattern instanceof RegExp) {
    if(!descriptor.pattern.test(value)) {
      errors.push(getErrorMessage(descriptor,
        util.format(messages.pattern.mismatch,
          descriptor.field, value, descriptor.pattern)));
    }
  }
}

// validators
var string = function(descriptor, value, callback, values) {
  var errors = [];
  required(descriptor, value, values, errors);
  type(descriptor, value, values, errors);
  strlen(descriptor, value, values, errors);
  ptn(descriptor, value, values, errors);
  callback(errors);
}

var pattern = function(descriptor, value, callback, values) {
  var errors = [];
  ptn(descriptor, value, values, errors);
  callback(errors);
}

var validators = module.exports = {
  string: string,
  pattern: pattern
}

module.exports.messages = messages;
