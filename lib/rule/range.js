var util = require('util');
var error = require('./error');
var messages = require('../messages');

/**
 *  Rule for validating minimum and maximum allowed values.
 *
 *  @param rule The validation rule.
 *  @param value The value of the field on the source object.
 *  @param source The source object being validated.
 *  @param errors An array of errors that this rule may add
 *  validation errors to.
 */
var range = function(rule, value, source, errors) {
  var min = typeof rule.min == 'number';
  var max = typeof rule.max == 'number';
  var val = value;
  var key = null;
  var num = typeof(value) == 'number';
  var str = typeof(value) == 'string';
  var arr = Array.isArray(value);
  if(num) {
    key = 'number';
  }else if(str) {
    key = 'string';
  }else if(arr) {
    key = 'array';
  }
  // if the value is not of a supported type for range validation
  // the validation rule rule should use the
  // type property to also test for a particular type
  if(!key) {
    return false;
  }
  if(str || arr) {
    val = value.length;
  }
  if( min && !max && val < rule.min ) {
    errors.push(error(rule,
      util.format(messages[key].min, rule.field, rule.min)));
  }
  if( max && !min && val > rule.max ) {
    errors.push(error(rule,
      util.format(messages[key].max, rule.field, rule.max)));
  }
  if(min && max && (val < min || val > max) ) {
    errors.push(error(rule,
      util.format(messages[key].range,
        rule.field, rule.min, rule.max)));
  }
}

module.exports = range;
