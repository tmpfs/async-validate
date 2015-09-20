var Schema = require('async-validate')
  , descriptor = {
      type: 'object',
      fields: {
        name: {type: "string", required: true}
      }
    }
  , schema = new Schema(descriptor)
  , source = {};

Schema.plugin([
  require('async-validate/plugin/object'),
  require('async-validate/plugin/string'),
  require('async-validate/plugin/util')
]);

schema.validate(source, function(err, res) {
  if(err) {
    throw err; 
  }else if(res) {
    // validation failed, res.errors is an array of all errors
    // res.fields is a map keyed by field unique id (eg: `address.name`)
    // assigned an array of errors per field
    return console.dir(res.errors)
  }
  // validation passed
});
