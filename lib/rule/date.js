var util = require('util');
var moment = require('moment');
var error = require('./error');

/**
 *  Rule for validating a date against a format.
 *
 *  @param rule The validation rule.
 *  @param value The value of the field on the source object.
 *  @param source The source object being validated.
 *  @param errors An array of errors that this rule may add
 *  validation errors to.
 *  @param options The validation options.
 *  @param options.messages The validation messages.
 */
var date = function(rule, value, source, errors, options) {
  if(!rule.required
     && (value == undefined || value == "")) {
    return false;
  }
  var dt = moment(Date.parse(value), rule.format);
  if(!dt) {
    errors.push(error(rule,
      util.format(options.messages.date.parse, rule.field, value)));
  }else if(!dt.isValid()) {
    if(rule.format) {
      errors.push(error(rule,
        util.format(options.messages.date.format, rule.field, value, rule.format)));
    }else{
      errors.push(error(rule,
        util.format(options.messages.date.invalid, rule.field, value)));
    }
  }
}

module.exports = date;
