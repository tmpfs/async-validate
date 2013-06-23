var util = require('util');
var error = require('./error');
var messages = require('../messages');

var pattern = function(descriptor, value, values, errors) {
  if(descriptor.pattern instanceof RegExp) {
    if(!descriptor.pattern.test(value)) {
      errors.push(error(descriptor,
        util.format(messages.pattern.mismatch,
          descriptor.field, value, descriptor.pattern)));
    }
  }
}

module.exports = pattern;
