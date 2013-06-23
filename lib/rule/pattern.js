var util = require('util');
var error = require('./error');
var messages = require('../messages');

var pattern = function(rule, value, values, errors) {
  if(rule.pattern instanceof RegExp) {
    if(!rule.pattern.test(value)) {
      errors.push(error(rule,
        util.format(messages.pattern.mismatch,
          rule.field, value, rule.pattern)));
    }
  }
}

module.exports = pattern;
