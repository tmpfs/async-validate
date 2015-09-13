var iterator = require('./iterator')
  , format = require('format-util')
  , Rule = require('./rule');

/**
 *  Encapsulates a validation schema.
 *
 *  @param rules Validation rules for this schema.
 *  @param opts Options for the schema.
 */
function Schema(rules, opts) {
  opts = opts || {};
  this.messages(opts.messages || require('../messages'));

  if(!rules) {
    throw new Error('Cannot configure a schema with no rules');
  }

  if(typeof rules !== 'object' || Array.isArray(rules)) {
    throw new Error('Rules must be an object')
  }

  rules = clone(rules);

  // wrap shorthand declaration without `fields`
  if(!rules.fields && !opts.deep) {
    rules = {fields: rules}; 
  }

  this.rules = rules;
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
 *  Validate an object against this schema.
 *
 *  @param source The object to validate.
 *  @param options Validation options.
 *  @param cb Callback  to invoke when validation is complete.
 */
function validate(source, options, cb) {
  if(typeof options === 'function') {
    cb = options;
    options = null;
  }
  options = options || {};

  //if(!this.keys.length) {
    //throw new Error('Cannot validate with no rules.');
  //}else if(!source) {
  if(!source && !options.deep) {
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

  if(options.bail) {
    options.first = options.single = true; 
  }

  // schema keys to iterate over
  keys = options.keys || this.keys;

  // iterator function series/parallel
  func = options.parallel ? iterator.map : iterator.mapSeries;

  // configure messages to use defaults where necessary
  messages = options.messages || this.messages();
  options.messages = messages;

  var rule = this.rules;
  series = Array.isArray(rule) ? rule : [rule];

  series.forEach(function(rule) {
    var value = source;

    // handle transformation
    if(typeof(rule.transform) === 'function') {
      value = rule.transform(source);
    }

    // wrap inline functions
    if(typeof(rule) === 'function') {
      rule = {validator: rule};
    }

    rule.field = options.field || 'source';

    if(!rule.type) {
      rule.type = typeof(source);
    }

    rule.type = getType(rule);
    rule.validator = getValidationMethod(rule);
    rule.value = value;
    rule.source = options.source || source;

  })
  
  //keys = options.keys || Object.keys(this.rules.fields);

  // iterate list data
  func(series, function(rule, callback) {

    var validator = getValidationOptions(rule, options)
      , len
      , i;

    var deep = (rule.type === 'object' || rule.type === 'array')
      && typeof(rule.fields) === 'object';

    //deep = deep && (rule.required || (!rule.required && rule.value));

    function onValidate(err) {
      var errors = validator.errors;

      // bail on first error
      if(options.first && errors && errors.length) {
        return complete(err, errors, options, cb);
      }

      // not deep so continue on to next in series
      if(!deep) {
        return callback(err, errors);

      // generate temp schema for nested rules
      }else{

        var keys = options.keys || Object.keys(rule.fields);

        //console.dir(keys);
        //console.dir(rule.fields);

        func(keys, function iterator(key, cb) {

          console.log('field key %s', key);

          var opts = clone(rule.options || options)
            , descriptor = rule.fields[key]
            , value = rule.value[key]
            , schema;

          if(descriptor.type === 'array'
              && typeof descriptor.values === 'object') {

            console.dir('expand values: ' + descriptor.values);
            console.dir(descriptor.values);

            // wrap objects as arrays
            var values = Array.isArray(descriptor.values)
              ? descriptor.values : [descriptor.values]
              , len;

            len = Array.isArray(descriptor.values)
              ? descriptor.values.length : Array.isArray(value)
                ? value.length : 0;

            console.dir(len);

            if(len) {
              descriptor.fields = {};
            }

            // object declaration applies to all array values
            if(!Array.isArray(descriptor.values)) {
              for(i = 0;i < len;i++) {
                descriptor.fields[i] = descriptor.values;
              } 
            }else{
              for(i = 0;i < len;i++) {
                descriptor.fields[i] = descriptor.values[i];
              } 
            }
          }


          //console.dir(key);
          //console.dir(value);
          console.dir(descriptor)

          // if rule is required but the target object
          // does not exist fail at the rule level and don't
          // go deeper
          if(descriptor.required && value === undefined) {
            errors.push(validator.error(options.messages.required, key));
            return cb();
          }

          schema = new Schema(
            descriptor, {messages: options.messages, deep: true});

          opts.deep = true;
          opts.field = key;
          // important to maintain original source for isRoot()
          opts.source = source;

          schema.validate(value, opts, function(err, res) {
            if(res && res.errors.length) {
              errors = errors.concat(res.errors); 
            }
            cb(err, null);
          });
        }, function(err, result) {
          callback(err, errors); 
        })

      }
    }
    console.log('validate %s', rule.validator.name);
    console.dir(rule);
    rule.validator.call(validator, onValidate);

  }, function(err, results) {
    complete(err, results, options, cb);
  });
}

/**
 *  @private
 *
 *  Get a validator with public fields.
 */
function getValidationOptions(rule, options) {
  return Rule({
    rule: rule,
    field: rule.field,
    value: rule.value,
    source: rule.source,
    errors: [],
    options: options,
    messages: options.messages
  });
}

/**
 *  @private
 *
 *  Infer the type of a rule.
 *
 *  @param rule The validation rule.
 */
function getType(rule) {
  if(rule.type == undefined
     && (rule.pattern instanceof RegExp)) {
    rule.type = 'pattern';
  }

  // handle instanceof tests for object type
  if(typeof rule.type === 'function') {
    rule.Type = rule.type;
    rule.type = 'object'; 
  }

  // validator plugin functions are static methods
  if(typeof(rule.validator) !== 'function'
     && (!rule.type || !Rule.hasOwnProperty(rule.type))) {
    throw new Error(format('Unknown rule type %s', rule.type));
  }
  return rule.type;
}

/**
 *  @private
 *
 *  Retrieve a validation method for a rule.
 *
 *  @param rule The validation rule.
 */
function getValidationMethod(rule) {
  if(typeof rule.validator === 'function') {
    return rule.validator;
  }
  // validator plugin functions are static methods
  return Rule[rule.type];
}

/**
 *  @private
 *
 *  Collates the errors arrays and maps field names to errors
 *  specific to the field.
 *
 *  Invokes callback when done.
 */
function complete(err, results, options, callback) {
  var i
    , field
    , errors = []
    , fields = {};

  for(i = 0;i < results.length;i++) {
    errors = errors.concat(results[i]);
  }

  if(errors.length) {
    if(options.single) {
      errors = errors.slice(0,1);
    }
    for(i = 0;i < errors.length;i++) {
      field = errors[i].field;
      fields[field] = fields[field] || [];
      fields[field].push(errors[i]);
    }
  }

  callback(err, !errors.length ? null : {errors: errors, fields: fields});
}


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

Schema.prototype.messages = messages;
Schema.prototype.validate = validate;

// static
Schema.clone = clone;
Schema.plugin = Rule.plugin;

module.exports = Schema;
