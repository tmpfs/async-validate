var plugin = require('zephyr')
  , format = require('./format')
  , types = require('./types')
  , Reason = require('./reason');

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
  this.reasons = Reason.reasons;
}

/**
 *  @private
 *
 *  Helper for creating validation errors.
 *
 *  If a rule has a message property it takes precedence.
 *
 *  @param message A custom messaage for the error.
 *  @param ... Replacement parameters passed to format.
 */
function error(message) {
  var msg
    , args = Array.prototype.slice.call(arguments, 1)
    , reason;

  // allow reason as first argument
  if(message instanceof Reason) {
    //this.reason(message);
    reason = message;
    message = arguments[1];
    args = args.slice(1);
  }
  
  if(typeof this.rule.message === 'function') {
    // TODO: allow calls to raise() and error() this would
    // TODO: stack overflow right now
    msg = this.rule.message.call(this, message, args); 

  }else{
    msg = this.rule.message
      || message || format(require('../messages').default, this.field);
  }

  if(typeof this.rule.message === 'object'
    && reason
    && this.rule.message[reason]) {
    msg = this.rule.message[reason];
  }

  if(arguments.length > 1 && !this.rule.message) {
    msg = format.apply(null, [msg].concat(args));
  }

  var err = new Error(msg);
  err.field = this.field;
  if(reason) {
    err.reason = reason; 
  }
  return err;
}

/**
 *  Get a new error reason.
 */
function getReason(id, opts) {
  return new Reason(id, opts);
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
  return err;
}

/**
 *  Rule for validating required fields.
 */
function required() {
  if(this.rule.required
     && (!this.source.hasOwnProperty(this.field)
        || this.value === undefined || this.value === null)) {
    this.raise(
      this.reasons.required,
      this.messages.required, this.field);
  }
}

/**
 *  Rule for validating a regular expression pattern.
 */
function pattern() {
  if((this.rule.pattern instanceof RegExp)
    && (!this.rule.pattern.test(this.value))) {
    this.raise(
      this.reasons.pattern,
      this.messages.pattern.mismatch,
      this.field, this.value, this.rule.pattern);
  }
}

/**
 *  Rule for validating the type of a value.
 */
function type() {
  var custom = ['integer', 'float', 'array', 'regexp', 'object', 'method']
    , rule = this.rule
    , value = this.value
    , type = rule.type
    , valid = true;

  // if value is required and value is undefined
  // no need to add this error message
  if(rule.required && (value === undefined || value === null)) {
    return;
  }

  if(~custom.indexOf(type)) {
    if(!types[type].call(this, value)) {
      valid = false;
    }
  // straight typeof check
  }else if(type && typeof(value) !== rule.type) {
    valid = false;
  }

  if(!valid) {
    this.raise(
      this.reasons.type,
      this.messages.types[type], this.field, rule.type);
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
    this.raise(
      this.reasons.length,
      this.messages[key].len, this.field, rule.len);
  }else if(min && !max && val < rule.min ) {
    this.raise(
      this.reasons.min,
      this.messages[key].min, this.field, rule.min);
  }else if( max && !min && val > rule.max ) {
    this.raise(
      this.reasons.max,
      this.messages[key].max, this.field, rule.max);
  }else if(min && max && (val < rule.min || val > rule.max) ) {
    this.raise(
      val < rule.min ? this.reasons.min : this.reasons.max,
      this.messages[key].range, this.field, rule.min, rule.max);
  }
}

/**
 *  Determine if validation is required for a field.
 */
function shouldValidate() {
  if(this.isRoot()) {
    return true; 
  }else if(this.value === undefined && !this.rule.required) {
    return false;
  }
  return this.rule.required
    || (!this.rule.required && this.source.hasOwnProperty(this.field));
}

/**
 *  Determine is additional fields are present.
 */
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

/**
 *  Determine if we are validating the root source object.
 */
function isRoot() {
  return this.source === this.value;
}

Validator.prototype.getReason = getReason;
Validator.prototype.error = error;
Validator.prototype.raise = raise;
Validator.prototype.required = required;
Validator.prototype.pattern = pattern;
Validator.prototype.range = range;
Validator.prototype.type = type;
Validator.prototype.format = format;
Validator.prototype.isRoot = isRoot;
Validator.prototype.shouldValidate = shouldValidate;
Validator.prototype.hasAdditionalFields = hasAdditionalFields;

module.exports = plugin({type: Validator});
