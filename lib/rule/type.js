var util = require('util');
var error = require('./error');
var messages = require('../messages');


var types = {};
types.integer = function(value) {
  return typeof(value) == 'number' && parseInt(value) === value;
}

types.float = function(value) {
  return typeof(value) == 'number' && !types.integer(value);
}

var type = function(descriptor, value, values, errors) {
  var custom = ['integer', 'float'];
  var type = descriptor.type;
  if(custom.indexOf(type) > -1) {
    if(!types[type](value)) {
      errors.push(error(descriptor,
        util.format(messages.types[type], descriptor.field, descriptor.type)));
    }
  // straight typeof check
  }else if(type && !(typeof(value) == descriptor.type)) {
    // if value is required and value is undefined
    // no need  to add this error message
    if(!descriptor.required && value != undefined ) {
      errors.push(error(descriptor,
        util.format(messages.types[type], descriptor.field, descriptor.type)));
    }
  }
}

module.exports = type;
