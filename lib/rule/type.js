var format = require('../format')
  , error = require('./error');

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

types.object = function(value) {
  return typeof(value) == 'object' && !types.array(value);
}

types.method = function(value) {
  return typeof(value) == 'function';
}

/**
 *  Rule for validating the type of a value.
 *
 *  @param opts The validation options.
 */
function type(opts) {
  var rule = opts.rule
    , value = opts.value
    , options = opts.options
    , errors = opts.errors;

  // if value is required and value is undefined
  // no need  to add this error message
  if(rule.required && (value === undefined || value === null)) {
    return;
  }

  var custom = ['integer', 'float', 'array', 'regexp', 'object', 'method'];
  var type = rule.type;
  if(custom.indexOf(type) > -1) {
    if(!types[type](value)) {
      errors.push(error(rule,
        format(options.messages.types[type], rule.field, rule.type)));
    }
  // straight typeof check
  }else if(type && !(typeof(value) == rule.type)) {
    errors.push(error(rule,
      format(options.messages.types[type], rule.field, rule.type)));
  }
}

module.exports = type;
