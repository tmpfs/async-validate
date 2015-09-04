var format = require('../format')
  , moment = require('moment');

/**
 *  Rule for validating a date against a format.
 *
 *  @param opts The validation options.
 */
function validator(opts) {
  var rule = opts.rule
    , value = opts.value
    , options = opts.options
    , errors = opts.errors;

  if(!rule.required
     && (value === undefined || value === "")) {
    return false;
  }
  var mmt = rule.local ? moment : moment.utc;
  var dt = !rule.format ? mmt(new Date(value)) : mmt(value, rule.format);
  //console.log('value %s', value);
  //console.log('format %s', rule.format);
  //console.log('date %s', dt);
  //console.log('date valid %s', dt.isValid());
  if(!dt) {
    errors.push(opts.error(rule,
      format(options.messages.date.parse, rule.field, value)));
  }else if(!dt.isValid()) {
    if(rule.format) {
      errors.push(opts.error(rule,
        format(options.messages.date.format, rule.field, value, rule.format)));
    }else{
      errors.push(opts.error(rule,
        format(options.messages.date.invalid, rule.field, value)));
    }
  }
}

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

    validator(opts);
  }
  cb(errors);
}

module.exports = date;
