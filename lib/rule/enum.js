var format = require('../format')
  , error = require('./error')

/**
 *  Rule for validating a value exists in an enumerable list.
 *
 *  @param opts The validation options.
 */
function enumerable(opts) {
  var rule = opts.rule
    , value = opts.value
    , options = opts.options
    , errors = opts.errors;
  rule.enum = Array.isArray(rule.enum) ? rule.enum : [];
  if(rule.enum.indexOf(value) == -1) {
    errors.push(error(rule,
      format(options.messages.enum, rule.field, rule.enum.join(', '))));
  }
}

module.exports = enumerable;
