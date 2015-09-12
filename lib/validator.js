var plugin = require('zephyr')
  , format = require('./format')
  , types = require('./type-test')
  , ValidationError = require('./error')
  , reasons = {
      type: 'type',
      required: 'required',
      pattern: 'pattern',
      length: 'length',
      additional: 'additional',
      enumerable: 'enum',
      date: 'date',
      whitespace: 'whitespace',
      min: 'min',
      max: 'max',
    }

/**
 *  Represents a rule associated with a value to validate.
 */
function Validator(opts) {
  if(!(this instanceof Validator)) {
    return new Validator(opts); 
  }
  for(var k in opts) {
    this[k] = opts[k];
  }
  // reason constants
  this.reasons = reasons;
}

/**
 *  Get or set a reason id for the current error.
 */
function reason(id) {
  if(id) {
    this._reason = id;
  }
  return this._reason; 
}

/**
 *  Helper for creating validation errors.
 *
 *  If a rule has a message property it takes precedence.
 *
 *  @param message A custom messaage for the error.
 *  @param ... Replacement parameters passed to format.
 */
function error(message) {
  var msg = this.rule.message
    || message || format(require('../messages').default, this.field);

  if(typeof this.rule.message === 'object'
    && this._reason
    && this.rule.message[this._reason]) {
    msg = this.rule.message[this._reason];
  }

  if(arguments.length > 1 && !this.rule.message) {
    var args = Array.prototype.slice.call(arguments, 1);
    msg = format.apply(null, [msg].concat(args));
  }
  var err = new ValidationError(msg);
  err.field = this.field;
  if(this._reason) {
    err.reason = this._reason; 
  }
  return err;
}

/**
 *  Create an error and adds it to the list of errors to be reported.
 */
function raise(message) {
  var parameters = [];
  if(arguments.length > 1) {
    parameters = Array.prototype.slice.call(arguments, 1); 
  }
  var err = this.error.apply(this, [message].concat(parameters));
  this.errors.push(err);
}

/**
 *  Rule for validating required fields.
 */
function required() {
  if(this.rule.required
     && (!this.source.hasOwnProperty(this.field)
        || this.value === undefined || this.value === null)) {
    this.reason(this.reasons.required);
    this.raise(this.messages.required, this.field);
  }
}

/**
 *  Rule for validating whitespace.
 */
function whitespace() {
  if(/^\s+$/.test(this.value) || this.value === '') {
    this.reason(this.reasons.whitespace);
    this.raise(this.messages.whitespace, this.field);
  }
}

/**
 *  Rule for validating a value exists in an enumerable list.
 */
function enumerable() {
  var list = this.rule.enum;
  if(list.indexOf(this.value) === -1) {
    this.reason(this.reasons.enumerable);
    this.raise(this.messages.enum, this.field, list.join(', '));
  }
}

/**
 *  Rule for validating a regular expression pattern.
 */
function pattern() {
  if(this.rule.pattern instanceof RegExp) {
    if(!this.rule.pattern.test(this.value)) {
      this.reason(this.reasons.pattern);
      this.raise(this.messages.pattern.mismatch,
        this.field, this.value, this.rule.pattern);
    }
  }
}

/**
 *  Rule for validating minimum and maximum allowed values.
 */
function range() {
  var rule = this.rule
    , value = this.value;

  var len = typeof rule.len === 'number';
  var min = typeof rule.min === 'number';
  var max = typeof rule.max === 'number';
  var val = value;
  var key = null;
  var num = typeof(value) === 'number';
  var str = typeof(value) === 'string';
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
  if(len && (val !== rule.len)) {
    this.reason(this.reasons.length);
    this.raise(this.messages[key].len, this.field, rule.len);
  }else if(min && !max && val < rule.min ) {
    this.reason(this.reasons.min);
    this.raise(this.messages[key].min, this.field, rule.min);
  }else if( max && !min && val > rule.max ) {
    this.reason(this.reasons.max);
    this.raise(this.messages[key].max, this.field, rule.max);
  }else if(min && max && (val < rule.min || val > rule.max) ) {
    this.reason(val < rule.min ? this.reasons.min : this.reasons.max);
    this.raise(this.messages[key].range, this.field, rule.min, rule.max);
  }
}

/**
 *  Rule for validating the type of a value.
 */
function type() {
  var custom = ['integer', 'float', 'array', 'regexp', 'object', 'method']
    , rule = this.rule
    , value = this.value
    , type = rule.type;

  // if value is required and value is undefined
  // no need to add this error message
  if(rule.required && (value === undefined || value === null)) {
    return;
  }

  if(custom.indexOf(type) > -1) {
    if(!types[type](value)) {
      this.reason(this.reasons.type);
      this.raise(this.messages.types[type], rule.field, rule.type);
    }
  // straight typeof check
  }else if(type && typeof(value) !== rule.type) {
    this.reason(this.reasons.type);
    this.raise(this.messages.types[type], rule.field, rule.type);
  }
}

/**
 *  Determine if validation is required for a field.
 */
function shouldValidate() {
  if(this.value === undefined && !this.rule.required) {
    return false;
  }
  return this.rule.required
    || (!this.rule.required && this.source.hasOwnProperty(this.field));
}

function hasAdditionalFields(expected, received) {
  var i
    , results = received.slice(0);

  for(i = 0;i < results.length;i++) {
    if(~expected.indexOf(results[i])) {
      results.splice(i, 1);
      i--;
    }  
  }

  // no additional fields found
  if(results.length === 0) {
    return false; 
  }

  // return diff array
  return results;
}

Validator.prototype.error = error;
Validator.prototype.raise = raise;
Validator.prototype.reason = reason;
Validator.prototype.required = required;
Validator.prototype.whitespace = whitespace;
Validator.prototype.enumerable = enumerable;
Validator.prototype.pattern = pattern;
Validator.prototype.range = range;
Validator.prototype.type = type;

Validator.prototype.shouldValidate = shouldValidate;
Validator.prototype.hasAdditionalFields = hasAdditionalFields;

// static access
Validator.error = error;
Validator.hasAdditionalFields = hasAdditionalFields;

module.exports = plugin({type: Validator});
