/**
 *  Default validation error messages.
 */
var messages = {
  default: 'Validation error on field %s',
  required: 'Field %s is required',
  type: 'Field %s is not a %s',
  types: {
    string: 'Field %s is not a %s',
    array: '%s is not an %s',
    number: '%s is not a %s',
    integer: '%s is not an %s',
    float: '%s is not a %s'
  },
  string: {
    min: 'Field %s must be at least %s characters',
    max: 'Field %s cannot be longer than %s characters',
    range: 'Field %s must be between %s and %s characters'
  },
  number: {
    min: '%s cannot be less than %s',
    max: '%s cannot be greater than %s',
    range: '%s must be between %s and %s'
  },
  array: {
    min: 'Array %s cannot be less than %s in length',
    max: 'Array %s cannot be greater than %s in length',
    range: 'Array %s must be between %s and %s in length'
  },
  pattern: {
    mismatch: 'Field %s value %s does not match pattern %s'
  }
}
module.exports = messages;
