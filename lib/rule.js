var plugin = require('zephyr')
  , format = require('format-util')
  , Reason = require('./reason');

/**
 *  Represents a rule associated with a value to validate.
 */
function Rule(opts) {
  if(!(this instanceof Rule)) {
    return new Rule(opts);
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
 *  @param reason A reason for the validation error.
 *  @param message A custom messaage for the error.
 *  @param ... Replacement parameters passed to format.
 */
function error(message) {
  var msg
    , err
    , res
    , args = Array.prototype.slice.call(arguments, 1)
    , reason
    , tmp;

  // allow reason as first argument
  if(message instanceof Reason) {
    reason = message;
    message = arguments[1];
    args = args.slice(1);
  }

  if(typeof(this.rule.message) === 'function') {
    // allow calls to error() so that message functions
    // may call `this.error()` and not create a stack
    // overflow, if the function returns an error it is used
    tmp = this.rule.message;
    this.rule.message = null;
    res = tmp.call(this, message, args);
    this.rule.message = tmp;
    if(res instanceof Error) {
      err = res;
    }else{
      msg = '' + res;
    }
  }else{
    msg = typeof(this.rule.message) === 'string'
      ? this.rule.message
      : message
          || format(require('../messages').default, this.field);
  }

  if(typeof this.rule.message === 'object'
    && reason
    && this.rule.message[reason]) {
    msg = this.rule.message[reason];
  }

  if(typeof(msg) === 'string'
    && arguments.length > 1 && !this.rule.message && !this.literal) {
    msg = format.apply(null, [msg].concat(args));
  }

  err = err || new Error(msg);
  err.field = this.field;
  err.value = this.value;
  err.parent = this.parent;
  err.names = this.names;
  err.key = this.key || err.field;

  //console.dir('raising error with names: ' + this.names);

  if(!this.key && this.names && this.names.length) {
    err.key = this.names.join('.');
  }

  //console.dir(err.key);

  if(reason) {
    err.reason = reason; 
  }
  return err;
}

/**
 *  Get a new error reason.
 */
function reason(id, opts) {
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
 *  Determine if validation is required for a field.
 */
function validates() {
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
function diff(expected, received) {
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

Rule.prototype.reason = reason;
Rule.prototype.error = error;
Rule.prototype.raise = raise;
Rule.prototype.format = format;
Rule.prototype.isRoot = isRoot;
Rule.prototype.validates = validates;
Rule.prototype.diff = diff;

module.exports = plugin({type: Rule, proto: Rule.prototype});
