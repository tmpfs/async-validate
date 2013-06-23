var util = require('util');
var error = require('./error');
var messages = require('../messages');

var type = function(descriptor, value, values, errors) {
  // if value is required and value is undefined
  // no need  to add this error message
  if(descriptor.type
     && !(typeof(value) == descriptor.type)) {
    if(!descriptor.required && value != undefined ) {
      errors.push(error(descriptor,
        util.format(messages.type, descriptor.field, descriptor.type)));
    }
  }
}

module.exports = type;
