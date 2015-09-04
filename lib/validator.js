var format = require('./format')
  , types = require('./type-test')
  , ValidationError = require('./error');

/**
 *  Represents a rule associated with a value to validate.
 */
function Validator(opts) {
  for(var k in opts) {
    this[k] = opts[k];
  }
}

/**
 *  Helper for creating validation errors.
 *
 *  If a rule has a message property it takes precedence.
 *
 *  @param rule The validation rule.
 *  @param message A custom messaage for the error.
 *  @param ... Replacement parameters passed to format.
 */
function error(rule, message) {
  var msg = rule.message
    || message || format(require('../messages').default, rule.field);

  if(arguments.length > 2) {
    var args = Array.prototype.slice.call(arguments, 1);
    msg = format.apply(null, args);
  }
  var err = new ValidationError(msg);
  err.field = rule.field;
  return err;
}

/**
 *  Create an error and adds it to the list of errors to be reported.
 */
function raise(rule, message, parameters) {
  if(arguments.length > 2
    && !Array.isArray(parameters)) {
    parameters = Array.prototype.slice.call(arguments, 2); 
  }
  if(typeof message === 'string' && Array.isArray(parameters)) {
    message = format.apply(null, [message].concat(parameters));
  }
  var err = this.error(rule, message);
  this.errors.push(err);
}

/**
 *  Rule for validating required fields.
 */
function required() {
  if(this.rule.required
     && (!this.source.hasOwnProperty(this.rule.field)
        || this.value === undefined || this.value === null)) {
    this.raise(this.rule, this.messages.required, this.rule.field);
  }
}

/**
 *  Rule for validating whitespace.
 */
function whitespace() {
  if(/^\s+$/.test(this.value) || this.value === '') {
    this.raise(this.rule, this.messages.whitespace, this.rule.field);
  }
}

/**
 *  Rule for validating a value exists in an enumerable list.
 */
function enumerable() {
  var list = Array.isArray(this.rule.enum) ? this.rule.enum : [];
  if(list.indexOf(this.value) === -1) {
    this.raise(this.rule, this.messages.enum, this.rule.field, list.join(', '));
  }
}

/**
 *  Rule for validating a regular expression pattern.
 */
function pattern() {
  if(this.rule.pattern instanceof RegExp) {
    if(!this.rule.pattern.test(this.value)) {
      this.raise(this.rule, this.messages.pattern.mismatch,
        this.rule.field, this.value, this.rule.pattern);
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
    this.raise(rule, this.messages[key].len, rule.field, rule.len);
  }else if( min && !max && val < rule.min ) {
    this.raise(rule, this.messages[key].min, rule.field, rule.min);
  }else if( max && !min && val > rule.max ) {
    this.raise(rule, this.messages[key].max, rule.field, rule.max);
  }else if(min && max && (val < rule.min || val > rule.max) ) {
    this.raise(rule, this.messages[key].range, rule.field, rule.min, rule.max);
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
  // no need  to add this error message
  if(rule.required && (value === undefined || value === null)) {
    return;
  }

  if(custom.indexOf(type) > -1) {
    if(!types[type](value)) {
      this.raise(rule, this.messages.types[type], rule.field, rule.type);
    }
  // straight typeof check
  }else if(type && typeof(value) !== rule.type) {
    this.raise(rule, this.messages.types[type], rule.field, rule.type);
  }
}

Validator.prototype.error = error;
Validator.prototype.raise = raise;

Validator.prototype.required = required;
Validator.prototype.whitespace = whitespace;
Validator.prototype.enumerable = enumerable;
Validator.prototype.pattern = pattern;
Validator.prototype.range = range;
Validator.prototype.type = type;

module.exports = Validator;
