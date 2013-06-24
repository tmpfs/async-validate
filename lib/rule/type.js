var util = require('util');
var error = require('./error');
var messages = require('../messages');


var types = {};
types.integer = function(value) {
  return typeof(value) == 'number' && parseInt(value) === value;
}

types.float = function(value) {
  return typeof(value) == 'number' && !types.integer(value);
}

types.array = function(value) {
  return Array.isArray(value);
}

types.regexp = function(value) {
  if(value instanceof RegExp) {
    return true;
  }
  try {
    var re = new RegExp(value);
    return true;
  }catch(e) {
    return false;
  }
}

/**
 *  Rule for validating the type of a value.
 *
 *  @param rule The validation rule.
 *  @param value The value of the field on the source object.
 *  @param source The source object being validated.
 *  @param errors An array of errors that this rule may add
 *  validation errors to.
 */
var type = function(rule, value, source, errors) {
  var custom = ['integer', 'float', 'array', 'regexp'];
  var type = rule.type;
  if(custom.indexOf(type) > -1) {
    if(!types[type](value)) {
      errors.push(error(rule,
        util.format(messages.types[type], rule.field, rule.type)));
    }
  // straight typeof check
  }else if(type && !(typeof(value) == rule.type)) {
    // if value is required and value is undefined
    // no need  to add this error message
    if(!rule.required && value != undefined ) {
      errors.push(error(rule,
        util.format(messages.types[type], rule.field, rule.type)));
    }
  }
}

module.exports = type;
