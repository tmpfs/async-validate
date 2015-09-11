var iterator = require('./iterator')
  , format = require('./format')
  , Validator = require('./validator')
  , error = Validator.Type.error
  , ValidationError = require('./error');

/**
 *  Encapsulates a validation schema.
 *
 *  @param descriptor An object declaring validation rules
 *  for this schema.
 */
function Schema(descriptor, opts) {
  opts = opts || {};
  this.rules = {};
  this.keys = [];
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

  this.keys = Object.keys(this.rules);
}

/**
 *  Collates the errors arrays and maps field names to errors
 *  specific to the field.
 */
function complete(results, options, callback) {
  var i, field, errors = [], fields = {};

  function add(e) {
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

/**
 *  Validate an object against this schema.
 *
 *  @param source The object to validate.
 *  @param options Validation options.
 *  @param cb Callback  to invoke when validation is complete.
 */
function validate(source, options, cb) {

  options = options || {};
  if(typeof options == 'function') {
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

  var messages = options.messages || this.messages();
  options.messages = messages;

  var j, z, arr, value, i, rule, validator, series = [];
  var keys = options.keys || Object.keys(this.rules);
  var func = options.parallel ? iterator.map : iterator.mapSeries;

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
      series.push({rule: rule, value: value, source: source, field: z});
    }
  }

  func(series, function(data, callback) {
    var rule = data.rule;
    var deep = (rule.type == 'object' || rule.type == 'array')
      && typeof(rule.fields) == 'object';
    deep = deep && (rule.required || (!rule.required && data.value));
    rule.field = data.field;

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
        if(rule.required && !data.value) {
          return callback(null, [
            new ValidationError(
              format(options.messages.required, rule.field))
          ]);
        }

        var schema = new Schema(data.rule.fields);
        schema.messages(options.messages);
        if(data.rule.options) {
          data.rule.options.messages = options.messages;
        }
        schema.validate(
          data.value, data.rule.options || options, function(errs, fields) {
          callback(null, errs && errs.length ? errors.concat(errs) : errs);
        });
      }
    }

    rule.validator.call(getValidationOptions(rule, data, options), onValidate);
  }, function(err, results) {
    complete(results, options, cb);
  });
}

function getValidationOptions(rule, data, options) {
  return Validator({
    rule: rule,
    field: rule.field,
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

Schema.Validator = Validator;
Schema.plugin = Validator.plugin;
Schema.ValidationError = ValidationError;

module.exports = Schema;
