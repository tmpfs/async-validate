var Schema = require('..')
  , descriptor = {name: {type: "string", required: true}}
  , schema = new Schema(descriptor)
  , source = {};

Schema.plugin([require('../plugin/string')]);

schema.validate(source, function(err, res) {
  if(err) {
    throw err; 
  }

  if(res) {
    // validation failed, errors is an array of all errors
    // fields is an object keyed by field name with an array of
    // errors per field
    return console.dir(res.errors)
  }
  // validation passed
});
