var format = require('../format')
  , error = require('./error');

/**
 *  Rule for validating required fields.
 *
 *  @param opts The validation options.
 */
function required(opts) {
  var rule = opts.rule
    , value = opts.value
    , source = opts.source
    , options = opts.options
    , errors = opts.errors;

  if(rule.required
     && (!source.hasOwnProperty(rule.field)
        || value === undefined || value === null)) {
    errors.push(error(rule,
      format(options.messages.required, rule.field)));
  }
}

module.exports = required;
