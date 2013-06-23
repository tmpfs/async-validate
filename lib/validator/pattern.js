var helper = require('../rule');

/**
 *  Performs validation when a descriptor rule only contains
 *  a pattern property but is not declared as a string type.
 */
var pattern = function(descriptor, value, callback, values) {
  var errors = [];
  helper.pattern(descriptor, value, values, errors);
  callback(errors);
}

module.exports = pattern;
