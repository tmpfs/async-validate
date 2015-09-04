var rules = require('../rule');

/**
 *  Validates a boolean.
 *
 *  @param opts The validation options.
 *  @param cb The callback function.
 */
function bool(opts, cb) {
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
  }
  cb(errors);
}

module.exports = bool;
