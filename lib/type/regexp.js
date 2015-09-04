var rules = require('../rule');

/**
 *  Validates the regular expression type.
 *
 *  @param opts The validation options.
 *  @param cb The callback function.
 */
function regexp(opts, cb) {
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
  }
  cb(errors);
}

module.exports = regexp;
