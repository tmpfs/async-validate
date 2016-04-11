var iterator = require('./iterator')
  , format = require('format-util')
  , Rule = require('./rule');

/**
 *  @private
 *
 *  Validate the type field.
 */
function validateRule(rule) {
  var i;

  if(typeof(rule) === 'function' || typeof(rule.test) === 'function') {
    return true;
  }

  function invalid() {
    throw new Error(
      'type property must be string or function: ' + rule.field); 
  }

  function isValid(type) {
    return type 
      && (typeof(type) === 'string' || typeof(type) === 'function');
  }

  if(Array.isArray(rule.type)) {
    for(i = 0;i < rule.type.length;i++) {
      if(!isValid(rule.type[i])) {
        invalid();
      } 
    }
  }else if(!isValid(rule.type)) {
    invalid(); 
  }
}

/**
 *  Encapsulates a validation schema.
 *
 *  @param rules Validation rules for this schema.
 *  @param opts Options for the schema.
 */
function Schema(rules, opts) {
  opts = opts || {};

  if(rules === undefined) {
    throw new Error('Cannot configure a schema with no rules');
  }

  if(!rules || typeof rules !== 'object' && typeof rules !== 'function') {
    throw new Error('Rules must be an object')
  }

  this.messages(opts.messages || require('../messages'));
  this.rules = rules;
}

/**
 *  Get or set the messages used for this schema.
 *
 *  @param msg The validation messages.
 *
 *  @return The validation messages.
 */
function messages(msg) {
  if(msg!== undefined) {
    this._messages = msg;
  }
  return this._messages;
}

/**
 *  Validate an object against this schema.
 *
 *  @param source The object to validate.
 *  @param opts Validation options.
 *  @param cb Callback  to invoke when validation is complete.
 */
function validate(source, opts, cb) {
  if(typeof opts === 'function') {
    cb = opts;
    opts = null;
  }
  opts = opts || {};

  if(source === undefined && !opts._deep) {
    throw new Error('Cannot validate with no source.');
  }else if(typeof cb !== 'function') {
    throw new Error('Cannot validate with no callback.');
  }

  if(opts.bail) {
    opts.first = opts.single = true; 
  }

  opts.messages = opts.messages || this.messages();

  var series = []
    , k
    , z
    , matcher
    , matchtmp
    , fields = this.rules.fields
    , state = opts.state || {}
    // iterator function series/parallel
    , func = opts.parallel ? iterator.map : iterator.mapSeries
    // configure messages to use defaults where necessary
    , messages = opts.messages;

  for(k in fields) {
    if(typeof fields[k] === 'object'
      && (fields[k].match instanceof RegExp)) {
      matcher = fields[k];
      delete fields[k];
      for(z in source) {
        if(matcher.match.test(z)) {
          matchtmp = Schema.clone(matcher);
          delete matchtmp.match;
          fields[z] = getRule(matchtmp, z, source[z]);
        }
      } 
    } 
  }

  this.rules = opts._deep ? this.rules : clone(this.rules);

  series = Array.isArray(this.rules) ? this.rules : [this.rules];

  function getRule(rule, field, value) {
    var assign;

    value = value || source
    rule.field = field || opts.field || 'source';

    if(typeof rule.resolve === 'function') {
      rule = rule.resolve.call(value); 
    }

    // default value placeholder
    if(value === undefined
      && typeof rule.placeholder === 'function') {
      value = assign = rule.placeholder(); 
    }

    // handle transformation
    if(typeof(rule.transform) === 'function') {
      value = assign = rule.transform(value);
    }

    if(assign && opts.parent && rule.field) {
      opts.parent[rule.field] = assign; 
    }

    // handle instanceof tests for object type
    if(typeof rule.type === 'function') {
      rule.Type = rule.type;
      rule.type = 'object'; 
    }

    validateRule(rule);

    if(typeof(rule.test) !== 'function'
      && Array.isArray(rule.type)) {
      rule.test = Rule.types;
    }

    if(typeof rule === 'function') {
      rule.test = rule;
    }else if(typeof rule.test !== 'function') {
      // scope plugin functions are static methods
      rule.test = Rule[rule.type];
    }

    rule.names = opts._names || [];

    if(rule.field && opts._deep) {
      rule.names = rule.names.concat(rule.field);
    }

    rule.parent = opts.parent || source;
    rule.value = value;
    rule.source = opts._source || source;

    if(typeof rule.test !== 'function') {
      throw new Error(format('Unknown rule type %s', rule.type));
    }

    return rule;
  }

  series = series.map(function(rule) {
    return getRule(rule);
  });

  // iterate list data
  func(series, function(rule, callback) {

    var vars = {}
      , k
      , scope
      , isDeep;

    // assign rule fields first
    for(k in rule) {
      // do not overwrite existing fields, eg: helper functions
      if(Rule.Type.prototype[k] === undefined) {
        vars[k] = rule[k];
      }
    }

    // next transient variables
    if(opts.vars) {
      for(k in opts.vars) {
        vars[k] = opts.vars[k]; 
      } 
    }

    // final built in properties
    vars.rule = rule;
    vars.field = rule.field;
    vars.value = rule.value;
    vars.source = rule.source;
    vars.names = rule.names;
    vars.errors = [];
    vars.state = state;
    vars.messages = messages;
    vars.literal = opts.literal;

    scope = Rule(vars);

    isDeep = (rule.type === 'object' || rule.type === 'array')
      && typeof(rule.fields) === 'object';
    isDeep = isDeep && (rule.required || (!rule.required && rule.value));

    function onValidate(err) {

      if(err) {
        return callback(err, scope.errors); 
      }

      // not deep so continue on to next in series
      if(!isDeep) {
        return callback(err, scope.errors);

      // generate temp schema for nested rules
      }else{

        var keys = opts.keys || Object.keys(rule.fields);

        func(keys, function iterator(key, cb) {

          // nested options for property iteration
          var options = clone(opts)
            , descriptor = rule.fields[key]
            , value = rule.value[key]
            , schema
            , i
            , len
            , tmp;

          // state object is by pointer
          options.state = state;

          if(descriptor.type === 'array'
              && typeof descriptor.values === 'object') {

            // wrap objects as arrays
            len = Array.isArray(descriptor.values)
              ? descriptor.values.length : Array.isArray(value)
                ? value.length : 0;

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

          // if rule is required but the target object
          // does not exist fail at the rule level and don't
          // go deeper
          if(descriptor.required && value === undefined) {
            tmp = Rule({
              field: key,
              rule: descriptor,
              names: rule.names,
              key: rule.names.concat(key).join('.'),
              errors: scope.errors,
              literal: opts.literal
            });
            tmp.raise(tmp.reasons.required, messages.required, key);
            return cb();
          }

          schema = new Schema(descriptor, {messages: options.messages});

          options.field = key;
          options.parent = rule.value;
          // important to maintain original source for isRoot()
          options._source = source;
          options._names = rule.names;
          options._deep = true;

          schema.validate(value, options, function(err, res) {
            if(res && res.errors.length) {
              scope.errors = scope.errors.concat(res.errors); 
            }
            cb(err, null);
          });
        }, function(err) {
          // bail on first error
          if(opts.first && scope.errors && scope.errors.length) {
            return complete(err, scope.errors, opts, cb);
          }
          callback(err, scope.errors); 
        })
      }
    }

    // invoke rule validation function
    rule.test.call(scope, onValidate);

  }, function(err, results) {
    complete(err, results, opts, cb);
  });
}

/**
 *  @private
 *
 *  Collates the errors arrays and maps field names to errors
 *  specific to the field.
 *
 *  Invokes callback when done.
 */
function complete(err, results, opts, callback) {
  var i
    , field
    , errors = []
    , fields = {};

  for(i = 0;i < results.length;i++) {
    errors = errors.concat(results[i]);
  }

  if(errors.length) {
    if(opts.single) {
      errors = errors.slice(0,1);
    }
    for(i = 0;i < errors.length;i++) {
      field = errors[i].key;
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
