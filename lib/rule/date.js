var format = require('../format')
  , moment = require('moment')
  , error = require('./error');

/**
 *  Rule for validating a date against a format.
 *
 *  @param opts The validation options.
 */
function date(opts) {
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
    errors.push(error(rule,
      format(options.messages.date.parse, rule.field, value)));
  }else if(!dt.isValid()) {
    if(rule.format) {
      errors.push(error(rule,
        format(options.messages.date.format, rule.field, value, rule.format)));
    }else{
      errors.push(error(rule,
        format(options.messages.date.invalid, rule.field, value)));
    }
  }
}

module.exports = date;
