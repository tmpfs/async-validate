var util = require('util');
var async = require('async');
var validators = require('./validator');
var messages = require('./messages');
var required = require('./validator/required');
var ValidationError = require('./error');

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
      "Cannot configure a schema with no rules");
  }
  if(!(typeof rules == 'object') || Array.isArray(rules)) {
    throw new Error("Rules must be an object")
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
 *  @param source The object to validate.
 *  @param options Validation options.
 *  @param callback A callback  to invoke when validation is complete.
 *
 *  @api public
 */
Schema.prototype.validate = function(source, options, callback) {
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
  var j, z, arr, value, i, rule, validator, series = [];
  var keys = options.keys || Object.keys(this.rules);
  for(j = 0;j < keys.length;j++) {
    z = keys[j];
    arr = this.rules[z];
    value = source[z];
    for(i = 0;i < arr.length;i++) {
      rule = arr[i];
      if(typeof(rule.transform) == 'function') {
        value = source[z] = rule.transform(value);
      }
      if(typeof(rule) == 'function') {
        rule = {validator: rule};
      }
      rule.field = z;
      rule.type = this.getType(rule);
      rule.validator = this.getValidationMethod(rule);
      if(!rule.validator) {
        continue;
      }
      validator = function(callback) {
        // mutate the async callback signature
        var cb = function(errors) {
          if(options.first) {
            return complete(errors);
          }
          callback(null, errors);
        }
        var data = arguments.callee.data;
        data.rule.validator(data.rule, data.value, cb, data.source);
      }
      validator.data = {rule: rule, value: value, source: source};
      series.push(validator);
      if((rule.type == 'object' || rule.type == 'array')
          && typeof(rule.fields) == 'object') {
        this.getDeepValidator(series, rule, value, options);
      }
    }
  }
  async.series(series, function(err, results) {
    complete(results);
  });
}

/**
 *  Infer the type of a rule when necessary.
 *
 *  @param rule The validation rule.
 *
 *  @api private
 */
Schema.prototype.getType = function(rule) {
  if(rule.type == undefined
     && (rule.pattern instanceof RegExp)) {
    rule.type = 'pattern';
  }
  if(typeof rule.validator == 'function') {
    return 'function';
  }
  if( !rule.type || !validators.hasOwnProperty(rule.type)) {
    throw new Error(util.format("Unknown rule type %s", rule.type));
  }
  return rule.type;
}

/**
 *  Retrieve a validation method from a rule.
 *
 *  @param rule The validation rule.
 *
 *  @api private
 */
Schema.prototype.getValidationMethod = function(rule) {
  if(typeof rule.validator == 'function') {
    return rule.validator;
  }
  return validators[rule.type]
    || function(rule, value, callback, source) {
      // default validation function always passes
      callback([]);
    };
}

/**
 *  Handles creating deep validation rules.
 *
 *  @param series The array of asynchronous functions.
 *  @param rule The validation rule.
 *  @param value The value on the source object.
 *  @param options The options passed to validate the object.
 *
 *  @api private
 */
Schema.prototype.getDeepValidator = function(series, rule, value, options) {
  if(value === undefined) {
    return false;
  }
  var deep = function(callback) {
    var data = arguments.callee.data;
    var schema = new Schema(data.rule.fields);
    schema.validate(
      data.value, data.rule.options || data.options, function(errors, fields) {
      callback(null, errors);
    });
  }
  deep.data = {rule: rule, value: value, options: options};
  series.push(deep);
}

/**
 *  Register a validator function for a type.
 *
 *  @param type The type for the validation rule.
 *  @param validator The validation function for the rule.
 *
 *  @api public
 */
module.exports.register = function(type, validator) {
  if(!(typeof validator == 'function')) {
    throw new Error(
      "Cannot register a validator by type, validator is not a function");
  }
  validators[type] = validator;
}

module.exports.rule = require('./rule');
module.exports.validators = validators;

var pattern = {
  email: /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/,
  url: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
  hex: /^#?([a-f0-9]{6}|[a-f0-9]{3})$/i
}
module.exports.pattern = pattern;
module.exports.error = ValidationError;
module.exports.messages = messages;

module.exports.rules = {};
module.exports.rules.std = {
  field: {type: "string", required: true, whitespace: true},
  email: {type: "string", required: true, pattern: pattern.email},
  url: {type: "string", required: true, pattern: pattern.url},
  hex: {type: "string", required: true, pattern: pattern.hex}
}
