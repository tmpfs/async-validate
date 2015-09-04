var format = require('../format')
  , error = require('./error');

/**
 *  Rule for validating whitespace.
 *
 *  @param opts The validation options.
 */
function whitespace(opts) {
  var rule = opts.rule
    , value = opts.value
    , options = opts.options
    , errors = opts.errors;
  if(/^\s+$/.test(value) || value == "") {
    errors.push(error(rule,
      format(options.messages.whitespace, rule.field)));
  }
}

module.exports = whitespace;
