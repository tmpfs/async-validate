var util = require('util');
var error = require('./error');
var messages = require('../messages');

var required = function(rule, value, values, errors) {
  if(rule.required
     && !values.hasOwnProperty(rule.field)) {
    errors.push(error(rule,
      util.format(messages.required, rule.field)));
  }
}

module.exports = required;
