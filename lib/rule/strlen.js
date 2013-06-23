var util = require('util');
var error = require('./error');
var messages = require('../messages');

var strlen = function(descriptor, value, values, errors) {
  var min = typeof descriptor.min == 'number';
  var max = typeof descriptor.max == 'number';
  if( min && !max && typeof(value) == 'string'
    && value.length < descriptor.min ) {
      errors.push(error(descriptor,
        util.format(messages.string.min, descriptor.field, descriptor.min)));
  }
  if( max && !min && typeof(value) == 'string'
    && value.length > descriptor.max ) {
      errors.push(error(descriptor,
        util.format(messages.string.max, descriptor.field, descriptor.max)));
  }
  if(min && max && typeof(value) == 'string'
    && (value.length < min || value.length > max) ) {
      errors.push(error(descriptor,
        util.format(messages.string.range,
          descriptor.field, descriptor.min, descriptor.max)));
  }
}

module.exports = strlen;
