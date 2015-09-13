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
 *  @param message A custom messaage for the error.
 *  @param ... Replacement parameters passed to format.
 */
function error(message) {
  var msg
    , args = Array.prototype.slice.call(arguments, 1)
    , reason;

  // allow reason as first argument
  if(message instanceof Reason) {
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
      || message
      || format(require('../messages').default, this.field);
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

Rule.prototype.getReason = getReason;
Rule.prototype.error = error;
Rule.prototype.raise = raise;
Rule.prototype.format = format;
Rule.prototype.isRoot = isRoot;
Rule.prototype.shouldValidate = shouldValidate;
Rule.prototype.diff = diff;

module.exports = plugin({type: Rule, proto: Rule.prototype});
