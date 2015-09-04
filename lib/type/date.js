var rules = require('../rule');

/**
 *  Validates a date against the format property.
 *
 *  @param opts The validation options.
 *  @param cb The callback function.
 */
function date(opts, cb) {
  var errors = opts.errors
    , rule = opts.rule
    , value = opts.value
    , source = opts.source
    , validate = rule.required
        || (!rule.required && source.hasOwnProperty(rule.field)
              && source[rule.field]);

  if(validate) {
    if(value === undefined && !rule.required) {
      return cb();
    }
    opts.required();
    opts.pattern();
    rules.date(opts);
  }
  cb(errors);
}

module.exports = date;
