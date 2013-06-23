var helper = require('../rule');

/**
 *  Performs validation for boolean types.
 */
var boolean = function(rule, value, callback, values) {
  var errors = [];
  //helper.required(rule, value, values, errors);
  helper.type(rule, value, values, errors);
  callback(errors);
}

module.exports = boolean;
