var util = require('util');
var error = require('./error');
var messages = require('../messages');

var whitespace = function(rule, value, values, errors) {
  if(/^\s+$/) {
    errors.push(error(rule,
      util.format(messages.whitespace, rule.field)));
  }
}

module.exports = whitespace;
