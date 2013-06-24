var helper = require('../rule');

/**
 *  Performs validation for string types.
 */
var string = function(rule, value, callback, source) {
  var errors = [];
  helper.required(rule, value, source, errors);
  helper.type(rule, value, source, errors);
  helper.range(rule, value, source, errors);
  helper.pattern(rule, value, source, errors);
  if(rule.whitespace === true) {
    helper.whitespace(rule, value, source, errors);
  }
  callback(errors);
}

module.exports = string;
