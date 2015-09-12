var iterator = require('./iterator')
  , format = require('./format')
  , Validator = require('./validator')
  , error = Validator.Type.error
  , ValidationError = require('./error');

/**
 *  Clone helper function.
 */
function clone(source, target) {
  var k
    , v;

  function isComplex(obj) {
    return Array.isArray(obj)
      || (obj && typeof obj === 'object') && !(obj instanceof RegExp);
  }

  // simple source object
  if(!isComplex(source)) {
    return source; 
  }

  target = target || (Array.isArray(source) ? [] : {});

  for(k in source) {
    v = source[k];
    if(isComplex(v)) {
      target[k] = Array.isArray(v) ? [] : {};
      clone(v, target[k]);
    }else{
      target[k] = v;
    }
  }

  return target;
}

function defineProp(target, prop, value) {
  Object.defineProperty(target, prop, {
    value: value,
    enumerable: false
  })
}

/**
 *  Encapsulates a validation schema.
 *
 *  @param descriptor Validation rules for this schema.
 *  @param opts Options for the schema.
 */
function Schema(descriptor, opts) {
  opts = opts || {};
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

  this.rules = {};
  this.keys = [];

  var z, item;
  for(z in rules) {
    item = clone(rules[z]);
    this.rules[z] = Array.isArray(item) ? item : [item];
  }

  this.keys = Object.keys(rules);
}

/**
 *  Collates the errors arrays and maps field names to errors
 *  specific to the field.
 */
function complete(results, options, callback) {
  var i
    , field
    , errors = []
    , fields = {};

  for(i = 0;i < results.length;i++) {
    errors = errors.concat(results[i]);
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

  // clean up flags
  delete options._root;

  callback(errors, fields);
}

/**
 *  Validate an object against this schema.
 *
 *  @param source The object to validate.
 *  @param options Validation options.
 *  @param cb Callback  to invoke when validation is complete.
 */
function validate(source, options, cb) {

  options = options || {};
  if(typeof options === 'function') {
    cb = options;
    options = {};
  }

  if(!this.keys.length) {
    throw new Error('Cannot validate with no rules.');
  }else if(!source) {
    throw new Error('Cannot validate with no source.');
  }else if(typeof cb !== 'function') {
    throw new Error('Cannot validate with no callback.');
  }

  var i
    , j
    , z
    , arr
    , value
    , rule
    , validator
    , series = []
    , keys
    , func
    , messages;

  // configure messages to use defaults where necessary
  messages = options.messages || this.messages();
  options.messages = messages;

  keys = options.keys || Object.keys(this.rules);

  // iterator function series/parallel
  func = options.parallel ? iterator.map : iterator.mapSeries;

  // rules for the root object
  if(options.rules && !options._root) {
    var rules = Array.isArray(options.rules) ? options.rules : [options.rules];

    rules = clone(rules);
    for(i = 0;i < rules.length;i++) {
      rule = rules[i];
      rule.field = options.field || 'source';
      rule.type = this.getType(rule);
      rule.validator = this.getValidationMethod(rule);
      rule.keys = this.keys;
      rule.value = source;
      rule.source = source;
      series.push(rule);
    }
    defineProp(options, '_root', true);
  }

  // convert map into iterable array
  // assigning field name to rule and perform transform
  for(j = 0;j < keys.length;j++) {
    z = keys[j];
    arr = this.rules[z];
    value = source[z];

    for(i = 0;i < arr.length;i++) {
      rule = arr[i];

      // handle transformation
      if(typeof(rule.transform) === 'function') {
        value = source[z] = rule.transform(value);
      }

      // wrap inline functions
      if(typeof(rule) === 'function') {
        rule = {validator: rule};
      }

      rule.field = z;
      rule.type = this.getType(rule);
      rule.validator = this.getValidationMethod(rule);
      rule.value = value;
      rule.source = source;
      series.push(rule);
    }
  }

  // iterate list data
  func(series, function(rule, callback) {
    var validator = getValidationOptions(rule, options)
      , len
      , i;

    if(rule.type === 'array' && typeof rule.values === 'object') {
      len = Array.isArray(rule.values)
        ? rule.values.length : Array.isArray(rule.value)
          ? rule.value.length : 0;

      if(len) {
        rule.fields = {};
      }

      // object declaration applies to all array values
      if(!Array.isArray(rule.values)) {
        for(i = 0;i < len;i++) {
          rule.fields[i] = rule.values;
        } 
      }else{
        for(i = 0;i < len;i++) {
          rule.fields[i] = rule.values[i];
        } 
      }
    }

    var deep = (rule.type === 'object' || rule.type === 'array')
      && typeof(rule.fields) === 'object';

    deep = deep && (rule.required || (!rule.required && rule.value));

    function onValidate(errors) {
      // bail on first error
      if(options.first && errors && errors.length) {
        return complete(errors, options, cb);
      }

      // not deep so continue on to next in series
      if(!deep) {
        callback(null, errors);

      // generate temp schema for nested rules
      }else{
        /* istanbul ignore next: always testing with errors array */
        errors = errors || [];

        // if rule is required but the target object
        // does not exist fail at the rule level and don't
        // go deeper
        if(rule.required && !rule.value) {
          return callback(null, [
            new ValidationError(
              format(options.messages.required, rule.field))
          ]);
        }

        var schema = new Schema(rule.fields);
        schema.messages(options.messages);
        schema.validate(
          rule.value, rule.options || options, function(errs, fields) {
          errors = errors.concat(errs || []);
          callback(null, errors);
        });
      }
    }
    rule.validator.call(validator, onValidate);

  }, function(err, results) {
    complete(results, options, cb);
  });
}

function getValidationOptions(rule, options) {
  return Validator({
    rule: rule,
    field: rule.field,
    value: rule.value,
    source: rule.source,
    data: options.data,
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

  // validator plugin functions are static methods
  var validators = Validator;
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
  // validator plugin functions are static methods
  var validators = Validator;
  if(typeof rule.validator === 'function') {
    return rule.validator;
  }
  return validators[rule.type];
}

Schema.prototype.messages = messages;
Schema.prototype.define = define;
Schema.prototype.validate = validate;
Schema.prototype.getType = getType;
Schema.prototype.getValidationMethod = getValidationMethod;

Schema.clone = clone;
Schema.Validator = Validator;
Schema.plugin = Validator.plugin;
Schema.ValidationError = ValidationError;

module.exports = Schema;
