/**
 *  Performs validation for string types.
 *
 *  @param opts The validation options.
 *  @param cb The callback function.
 */
function string(opts, cb) {
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
    opts.pattern();

    if(rule.whitespace === true) {
      opts.whitespace();
    }
  }
  cb(errors);
}

module.exports = string;
