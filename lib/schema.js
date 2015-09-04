var iterator = require('./iterator')
  , format = require('./format')
  , Validator = require('./validator')
  , validators = require('./type')
  , ValidationError = require('./error')
  , error = Validator.error;

/**
 *  Encapsulates a validation schema.
 *
 *  @param descriptor An object declaring validation rules
 *  for this schema.
 */
function Schema(descriptor, opts) {
  opts = opts || {};
  this.rules = {};
  this.messages(opts.messages || require('../messages'));
  this.define(descriptor);
}

/**
 *  Get or set the messages used for this schema.
 *
 *  @param messages The validation messages.
 *
 *  @return The validation messages.
 */
function messages(messages) {
  if(messages !== undefined) {
    this._messages = messages;
  }
  return this._messages;
}

/**
 *  Define rules on this schema.
 *
 *  If rules are already defined new rules will overwrite or add to the 
 *  previously defined rules.
 *
 *  @param rules The schema rules.
 */
function define(rules) {
  if(!rules) {
    throw new Error('Cannot configure a schema with no rules');
  }
  if(typeof rules !== 'object' || Array.isArray(rules)) {
    throw new Error('Rules must be an object')
  }
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
 */
function validate(source, options, callback) {
  if(!this.rules) {
    throw new Error('Cannot validate with no rules.');
  }
  options = options || {};
  if(typeof options == 'function') {
    callback = options;
    options = {};
  }
  var complete = function(results) {
    var i, field, errors = [], fields = {};
    var add = function(e) {
      if((e instanceof Error)) {
        errors.push(e);
      }else if(Array.isArray(e)) {
        errors = errors.concat.apply(errors, e);
      }
    }
    for(i = 0;i < results.length;i++) {
      add(results[i]);
    }
    if(!errors.length) {
      errors = null, fields = null;
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
  var messages = options.messages || this.messages();
  options.messages = messages;
  options.error = error;
  options.exception = ValidationError;
  var j, z, arr, value, i, rule, validator, series = [];
  var keys = options.keys || Object.keys(this.rules);
  for(j = 0;j < keys.length;j++) {
    z = keys[j]; arr = this.rules[z]; value = source[z];
    //console.log('validate on key %s', z);
    for(i = 0;i < arr.length;i++) {
      rule = arr[i];

      //console.log('validate on rule %j', rule);
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
      series.push({rule: rule, value: value, source: source, field: z});
    }
  }
  var func = options.parallel ? iterator.map : iterator.mapSeries;
  func(series, function(data, callback) {
    var rule = data.rule;
    var deep = (rule.type == 'object' || rule.type == 'array')
      && typeof(rule.fields) == 'object';
    deep = deep && (rule.required || (!rule.required && data.value));
    rule.field = data.field;
    var cb = function(errors) {
      if(options.first && errors && errors.length) {
        return complete(errors);
      }
      if(!deep) {
        callback(null, errors);
      }else{
        errors = errors || [];
        // if rule is required but the target object
        // does not exist fail at the rule level and don't
        // go deeper
        if(rule.required && !data.value) {
          return callback(null, [
            options.error(
              rule, format(options.messages.required, rule.field))
          ]);
        }
        var schema = new Schema(data.rule.fields);
        schema.messages(options.messages);
        if(data.rule.options) {
          data.rule.options.messages = options.messages;
          data.rule.options.exception = options.exception;
          data.rule.options.error = options.error;
        }
        schema.validate(
          data.value, data.rule.options || options, function(errs, fields) {
          callback(null, errs && errs.length ? errors.concat(errs) : errs);
        });
      }
    }

    var opts = getValidationOptions(rule, data, options, cb);
    rule.validator(opts, cb);

    //rule.validator(
      //rule, data.value, cb, data.source, options);
  }, function(err, results) {
    complete(results);
  });
}

function getValidationOptions(rule, data, options, cb) {
  return new Validator({
    callback: cb,
    rule: rule,
    value: data.value,
    source: data.source,
    data: data,
    errors: [],
    options: options,
    messages: options.messages
  });
}

/**
 *  Infer the type of a rule when necessary.
 *
 *  @param rule The validation rule.
 */
function getType(rule) {
  if(rule.type == undefined
     && (rule.pattern instanceof RegExp)) {
    rule.type = 'pattern';
  }
  if(typeof(rule.validator) !== 'function'
     && (!rule.type || !validators.hasOwnProperty(rule.type))) {
    throw new Error(format('Unknown rule type %s', rule.type));
  }
  return rule.type;
}

/**
 *  Retrieve a validation method from a rule.
 *
 *  @param rule The validation rule.
 */
function getValidationMethod(rule) {
  if(typeof rule.validator === 'function') {
    return rule.validator;
  }
  return validators[rule.type] || false;
}

Schema.prototype.messages = messages;
Schema.prototype.define = define;
Schema.prototype.validate = validate;
Schema.prototype.getType = getType;
Schema.prototype.getValidationMethod = getValidationMethod;

module.exports = Schema;

/**
 *  Register a validator function for a type.
 *
 *  @param type The type for the validation rule.
 *  @param validator The validation function for the rule.
 *
 *  @api public
 */
module.exports.register = function(type, validator) {
  if(typeof validator !== 'function') {
    throw new Error(
      'Cannot register a validator by type, validator is not a function');
  }
  validators[type] = validator;
}

module.exports.ValidationError = ValidationError;
