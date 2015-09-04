var rules = require('../rule');

/**
 *  Validates an object.
 *
 *  @param opts The validation options.
 *  @param cb The callback function.
 */
function object(opts, cb) {
  var errors = opts.errors
    , rule = opts.rule
    , value = opts.value
    , source = opts.source
    , validate = rule.required
        || (!rule.required && source.hasOwnProperty(rule.field));

  if(validate) {
    if(value === undefined && !rule.required) return cb();
    rules.required(opts);
    if(rule.required || value != undefined) {
      rules.type(opts);
    }
  }
  cb(errors);
}

module.exports = object;
