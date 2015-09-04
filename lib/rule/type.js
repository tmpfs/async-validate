var format = require('../format')
  , error = require('./error')
  , types = require('../tests');

/**
 *  Rule for validating the type of a value.
 *
 *  @param opts The validation options.
 */
function type(opts) {
  var rule = opts.rule
    , value = opts.value
    , options = opts.options
    , errors = opts.errors
    , custom = ['integer', 'float', 'array', 'regexp', 'object', 'method']
    , type = rule.type;

  // if value is required and value is undefined
  // no need  to add this error message
  if(rule.required && (value === undefined || value === null)) {
    return;
  }

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
