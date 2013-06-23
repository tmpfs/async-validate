var util = require('util');
var error = require('./error');
var messages = require('../messages');

var required = function(descriptor, value, values, errors) {
  if(descriptor.required
     && !values.hasOwnProperty(descriptor.field)) {
    errors.push(error(descriptor,
      util.format(messages.required, descriptor.field)));
  }
}

module.exports = required;
