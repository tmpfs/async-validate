var Schema = require('..')
  , descriptor = {name: {type: "string", required: true}}
  , schema = new Schema(descriptor)
  , source = {};

Schema.plugin([
  require('../plugin/util'),
  require('../plugin/string')]);

schema.validate(source, function(err, res) {
  if(err) {
    throw err; 
  }else if(res) {
    // validation failed, res.errors is an array of all errors
    // res.fields is a map keyed by field name with an array of
    // errors per field
    return console.dir(res.errors)
  }
  // validation passed
});
