/**
 *  Default validation error messages.
 */
var messages = {
  default: 'error on field %s',
  required: '%s is required',
  enum: '%s must be one of %s',
  whitespace: '%s cannot be empty',
  additional: 'extraneous fields (%s) found in %s',
  date: {
    format: '%s date %s is invalid for format %s',
    invalid: '%s date %s is invalid'
  },
  types: {
    string: '%s is not a %s',
    null: '%s is not %s',
    function: '%s is not a %s',
    instance: '%s is not an instance of %s',
    array: '%s is not an %s',
    object: '%s is not an %s',
    number: '%s is not a %s',
    boolean: '%s is not a %s',
    integer: '%s is not an %s',
    float: '%s is not a %s',
    regexp: '%s is not a valid %s',
    multiple: '%s is not one of the allowed types %s'
  },
  function: {
    len: '%s must have exactly %s arguments',
    min: '%s must have at least %s arguments',
    max: '%s cannot have more than %s arguments',
    range: '%s must have arguments length between %s and %s'
  },
  string: {
    len: '%s must be exactly %s characters',
    min: '%s must be at least %s characters',
    max: '%s cannot be longer than %s characters',
    range: '%s must be between %s and %s characters'
  },
  number: {
    len: '%s must equal %s',
    min: '%s cannot be less than %s',
    max: '%s cannot be greater than %s',
    range: '%s must be between %s and %s'
  },
  array: {
    len: '%s must be exactly %s in length',
    min: '%s cannot be less than %s in length',
    max: '%s cannot be greater than %s in length',
    range: '%s must be between %s and %s in length'
  },
  pattern: {
    mismatch: '%s value %s does not match pattern %s'
  }
};

module.exports = messages;
