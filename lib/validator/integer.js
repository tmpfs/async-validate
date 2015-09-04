var rules = require('../rule');

/**
 *  Validates a number is an integer.
 *
 *  @param opts The validation options.
 *  @param cb The callback function.
 */
function integer(opts, cb) {
  var errors = opts.errors
    , rule = opts.rule
    , value = opts.value
    , source = opts.source
    , validate = rule.required
        || (!rule.required && source.hasOwnProperty(rule.field));

  if(validate) {
    if(value === undefined && !rule.required) {
      return cb();
    }
    rules.required(opts);
    rules.type(opts);
    rules.range(opts);
  }
  cb(errors);
}

module.exports = integer;
