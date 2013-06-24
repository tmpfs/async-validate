var async = require('async');
var validators = require('./validator');

/**
 *  Encapsulates a validation schema.
 *
 *  @param descriptor An object declaring validation rules
 *  for this schema.
 */
var Schema = module.exports = function(descriptor) {
  this.rules = null;
  this.define(descriptor);
}

/**
 *  Define rules on this schema.
 *
 *  @param rules The schema rules.
 *
 *  @api public
 */
Schema.prototype.define = function(rules) {
  if(!rules) {
    throw new Error(
      "Cannot configure a schema with no rule.");
  }
  if(!(typeof rules == 'object') || Array.isArray(rules)) {
    throw new Error("Rules must be an object.")
  }
  this.rules = {};
  var z, item;
  for(z in rules) {
    item = rules[z];
    this.rules[z] = Array.isArray(item) ? item : [item];
  }
}

/**
 *  Validate an object against this schema.
 *
 *  @param values The object to validate.
 *  @param options Validation options.
 *  @param callback A callback  to invoke when validation is complete.
 *
 *  @api public
 */
Schema.prototype.validate = function(values, options, callback) {
  if(!this.rules) {
    throw new Error("Cannot validate with no rules.");
  }
  options = options || {};
  if(typeof options == 'function') {
    callback = options;
    options = {};
  }
  var complete = function(results) {
    var errors = [], fields = {};
    var add = function(e) {
      if((e instanceof Error)) {
        errors.push(e);
      }else if(Array.isArray(e)) {
        errors = errors.concat.apply(errors, e);
      }
    }
    var i, field;
    for(i = 0;i < results.length;i++) {
      add(results[i]);
    }
    if(!errors.length) {
      errors = null;
      fields = null;
    }else{
      if(options.single) {
        errors = errors.slice(0,1);
      }
      for(i = 0;i < errors.length;i++) {
        field = errors[i].field;
        fields[field] = fields[field] || [];
        fields[field].push(errors[i]);
      }
    }
    callback(errors, fields);
  }
  var z, arr, value, i, rule, validator, series = [];
  for(z in this.rules) {
    arr = this.rules[z];
    value = values[z];
    for(i = 0;i < arr.length;i++) {
      rule = arr[i];
      if(typeof(rule) == 'function') {
        rule = {validator: rule};
      }
      rule.field = z;
      rule.validator = this.getValidationMethod(rule);
      validator = function(callback) {
        // mutate the async callback signature
        var cb = function(errors) {
          if(options.first) {
            return complete(errors);
          }
          callback(null, errors);
        }
        var rule = arguments.callee.rule;
        var value = arguments.callee.value;
        var values = arguments.callee.values;
        rule.validator(rule, value, cb, values);
      }
      validator.rule = rule;
      validator.value = value;
      validator.values = values;
      series.push(validator);
    }
  }
  async.series(series, function(err, results) {
    complete(results);
  });
}

/**
 *  Retrieve a validation method from a rule.
 *
 *  @param rule The field rule.
 *
 *  @api private
 */
Schema.prototype.getValidationMethod = function(rule) {
  if(typeof rule.validator == 'function') {
    return rule.validator;
  }
  if(rule.type == undefined
     && (rule.pattern instanceof RegExp)) {
    rule.type = 'pattern';
  }
  return validators[rule.type]
    || function(rule, value, callback, values) {
      // default validation function always passes
      callback([]);
    };
}

module.exports.rule = require('./rule');
module.exports.validators = validators;

var pattern = {
  email: /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/,
  url: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
  hex: /^#?([a-f0-9]{6}|[a-f0-9]{3})$/i
}
module.exports.pattern = pattern;

module.exports.rules = {};
module.exports.rules.std = {
  field: {type: "string", required: true, whitespace: true},
  email: {type: "string", required: true, pattern: pattern.email},
  url: {type: "string", required: true, pattern: pattern.url},
  hex: {type: "string", required: true, pattern: pattern.hex}
}
