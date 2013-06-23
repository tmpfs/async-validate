var helper = require('../rule');

/**
 *  Performs validation when a rule only contains
 *  a pattern property but is not declared as a string type.
 */
var pattern = function(rule, value, callback, values) {
  var errors = [];
  helper.pattern(rule, value, values, errors);
  callback(errors);
}

module.exports = pattern;
