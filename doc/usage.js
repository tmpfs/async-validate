var Schema = require('..')
  , descriptor = {name: {type: "string", required: true}}
  , schema = new Schema(descriptor)
  , source = {};

Schema.plugin([require('../plugin/string')]);

schema.validate(source, function(errors, fields) {
  if(errors) {
    // validation failed, errors is an array of all errors
    // fields is an object keyed by field name with an array of
    // errors per field
    return console.dir(errors)
  }
  // validation passed
});
