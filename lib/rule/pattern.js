var format = require('../format')
  , error = require('./error');

/**
 *  Rule for validating a regular expression pattern.
 *
 *  @param opts The validation options.
 */
function pattern(opts) {
  var rule = opts.rule
    , value = opts.value
    , options = opts.options
    , errors = opts.errors;

  if(rule.pattern instanceof RegExp) {
    if(!rule.pattern.test(value)) {
      errors.push(error(rule,
        format(options.messages.pattern.mismatch,
          rule.field, value, rule.pattern)));
    }
  }
}

module.exports = pattern;
