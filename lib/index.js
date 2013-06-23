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
 *  Retrieve a validation method from a rule.
 *
 *  @param rule The field rule.
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

/**
 *  Validate an object against this schema.
 *
 *  @param values The object to validate.
 *  @param options Validation options.
 *  @param callback A callback  to invoke when validation is complete.
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
      //console.log("Adding rule %s, %s", rule.field, rule.pattern);
      validator.value = value;
      validator.values = values;
      series.push(validator);
    }
  }
  async.series(series, function(err, results) {
    complete(results);
  });
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

//function validate (schema, values, options) {
  //var validator;

  //options = options || validate.options;
  //validator = new Validator(schema, values, options).run();

  //return validator.errors.length
    //? validator.errors
    //: validator.accepted;
//}

//validate.re = {
    //email : /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/
  //, url   : /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/
  //, hex   : /^#?([a-f0-9]{6}|[a-f0-9]{3})$/
//};

//validate.Validator = Validator;

//function Validator (schema, object, options) {
  //this.object = object;
  //this.accepted = {};
  //this.schema = schema;
  //this.errors = [];

  //for (var o in options)
    //this[o] = options[o];
//}

//// Default message
//Validator.prototype.defaultMessage = 'A validation error occured';

//// Malformed data
//Validator.prototype.malformedMessage = 'The data is malformed';

//Validator.prototype.walk = function (schema, object, accepted) {
  //schema = schema || this.schema;
  //object = object || this.object;
  //accepted = accepted || this.accepted;

  //if (!isObject(object)) {
    //this.errors.push(new Error(this.malformedMessage));
    //return this;
  //}

  //Object.keys(schema).forEach(function (key) {
    //var args = schema[key]
      //, fields = object[key];

    //if (isObject(fields)) {
      //accepted[key] = {};
      //return this.walk(args, fields, accepted[key]);
    //}

    //if (!Array.isArray(fields) || args.cast) {
      //if (!this.cast && this.validate(key, args, fields) && fields)
        //accepted[key] = fields;

      //if (this.cast || args.cast)
        //this.typecast(args, object, key, accepted);

      //return;
    //}

    //if (!this.validate(key, args, fields)) return;

    //accepted[key] = [];

    //fields.forEach(function (value, index) {
      //var schema = args.values;

      //if (isObject(value)) {
        //accepted[key][index] = {};
        //return this.walk(schema, value, accepted[key][index]);
      //}

      //if (!this.cast && this.validate(key, schema, value))
        //accepted[key][index] = value;

      //if (this.cast || schema.cast)
        //this.typecast(schema, fields, index, accepted[key]);
    //}, this);
  //}, this);

  //return this;
//}

//Validator.prototype.run = Validator.prototype.walk;

//Validator.prototype.validate = function (key, schema, value, ignore) {
  //var message = schema.message || this.defaultMessage + ' on field ' + key
    //, skip = false
    //, valid = true;

  //if (!value && !schema.required) return true;

  //for (var key in schema) {
    //skip = ['message', 'cast', 'values'].indexOf(key) >= 0;
    //valid = this[key] && this[key](schema[key], value);

    //if (skip || valid) continue;

    //if (!ignore)
      //this.errors.push(new Error(message));

    //return false;
  //}

  //return true;
//};

//Validator.prototype.typecast = function (schema, parent, key, accepted) {
  //var value = parent[key]
    //, temp = {}
    //, field = {}
    //, message = schema.message || this.defaultMessage + ' on field ' + key
    //, type = schema.cast || schema.type;

  //if (!value && this.validate(key, schema, value, true))
    //return accepted[key] = value;

  //if (isObject(type)) {
    //if (!type.type)
      //throw new Error('Typecasting requires a type');

    //field[key] = type;

    //this.typecast(type, parent, key, temp);
    //return this.walk(field, temp, accepted);
  //}

  //switch (type) {
    //case undefined:
      //break;
    //case 'number':
      //value = parseInt(value, 10);
      //if (!isNaN(value)) break;
      //return this.errors.push(new Error(message));
    //case 'email':
    //case 'url':
    //case 'hex':
    //case 'string':
      //value = value.toString();
      //break;
    //case 'date':
      //value = new Date(value);
      //if (!isNaN(value.getTime())) break;
      //return this.errors.push(new Error(message))
    //case 'regexp':
      //value = new RegExp(value);
      //break;
    //case 'boolean':
      //value = value && value !== 'false';
      //break;
    //default:
      //value = type.call(this, value);
  //}

  //if (!this.cast || this.validate(key, schema, value))
    //return accepted[key] = value;
//};

//Validator.prototype.max = function (num, value) {
  //return value <= num;
//};

//Validator.prototype.min = function (num, value) {
  //return value >= num;
//};

//Validator.prototype.len = function (num, value) {
  //return value.length === num;
//};

//Validator.prototype.minLen = function (num, value) {
  //return value.length >= num;
//};

//Validator.prototype.maxLen = function (num, value) {
  //return value.length <= num;
//};

//Validator.prototype.match = function (re, value) {
  //return re.test(value);
//};

//Validator.prototype.type = function (type, value) {
  //switch (type) {
    //case 'email':
      //return validate.re.email.test(value);
    //case 'url':
      //return validate.re.url.test(value);
    //case 'hex':
      //return validate.re.hex.test(value);
    //case 'date':
      //return value instanceof Date;
    //case 'regexp':
      //return value instanceof RegExp;
    //case 'array':
      //return Array.isArray(value);
    //default:
      //return typeof value === type;
  //}
//};

//Validator.prototype.custom = function (fn, value) {
  //return fn.call(this, value);
//};

//Validator.prototype.required = function (bool, value) {
  //return !!value;
//};

//function isObject (obj) {
  //return Object.prototype.toString.call(obj) === '[object Object]';
//}

//module.exports = validate;
