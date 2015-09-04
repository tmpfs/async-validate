var rules = require('../rule');

/**
 *  Validates an enumerable list.
 *
 *  @param opts The validation options.
 *  @param cb The callback function.
 */
function enumerable(opts, cb) {
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

    opts.enumerable();
    //rules.enum(opts);
  }
  cb(errors);
}

module.exports = enumerable;
