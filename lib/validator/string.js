var helper = require('../rule');

/**
 *  Performs validation for string types.
 */
var string = function(rule, value, callback, values) {
  var errors = [];
  helper.required(rule, value, values, errors);
  helper.type(rule, value, values, errors);
  helper.range(rule, value, values, errors);
  helper.pattern(rule, value, values, errors);
  if(rule.whitespace === true) {
    helper.whitespace(rule, value, values, errors);
  }
  callback(errors);
}

module.exports = string;
