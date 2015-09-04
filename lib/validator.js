var format = require('./format')
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
    //errors.push(error(rule,
      //format(options.messages.enum, rule.field, rule.enum.join(', '))));
  }
}


Validator.prototype.error = error;
Validator.prototype.raise = raise;
Validator.prototype.whitespace = whitespace;
Validator.prototype.enumerable = enumerable;

module.exports = Validator;
