var rules = require('../rule');

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

    rules.type(opts);
    rules.range(opts);

    opts.pattern();

    if(rule.whitespace === true) {
      opts.whitespace(opts);
    }
  }
  cb(errors);
}

module.exports = string;
