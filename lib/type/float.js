/**
 *  Validates a number is a floating point number.
 *
 *  @param opts The validation options.
 *  @param cb The callback function.
 */
function fraction(opts, cb) {
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

    opts.required();
    opts.type();
    opts.range();
  }
  cb(errors);
}

module.exports = fraction;
