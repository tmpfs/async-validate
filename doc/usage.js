var schema = require('..')
  , descriptor = {name: {type: "string", required: true}}
  , validator = new schema(descriptor)
  , source = {};

schema.plugin(
  [require('../plugin/string')]);

validator.validate(source, function(errors, fields) {
  if(errors) {
    // validation failed, errors is an array of all errors
    // fields is an object keyed by field name with an array of
    // errors per field
    return console.dir(errors)
  }
  // validation passed
});
