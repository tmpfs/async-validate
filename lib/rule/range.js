var util = require('util');
var error = require('./error');
var messages = require('../messages');

var range = function(descriptor, value, values, errors) {
  var min = typeof descriptor.min == 'number';
  var max = typeof descriptor.max == 'number';
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
  // the validation descriptor rule should use the
  // type property to also test for a particular type
  if(!key) {
    return false;
  }
  if(str || arr) {
    val = value.length;
  }
  if( min && !max && val < descriptor.min ) {
    errors.push(error(descriptor,
      util.format(messages[key].min, descriptor.field, descriptor.min)));
  }
  if( max && !min && val > descriptor.max ) {
    errors.push(error(descriptor,
      util.format(messages[key].max, descriptor.field, descriptor.max)));
  }
  if(min && max && (val < min || val > max) ) {
    errors.push(error(descriptor,
      util.format(messages[key].range,
        descriptor.field, descriptor.min, descriptor.max)));
  }
}

module.exports = range;
