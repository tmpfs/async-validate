var helper = require('../rule');

/**
 *  Performs validation for boolean types.
 */
var boolean = function(rule, value, callback, source) {
  var errors = [];
  helper.required(rule, value, source, errors);
  helper.type(rule, value, source, errors);
  callback(errors);
}

module.exports = boolean;
