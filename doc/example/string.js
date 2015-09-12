var Schema = require('../../')
  , descriptor = {
    name: {type: 'string', required: true}
  }
  , source = {}
  , schema;

Schema.plugin([require('../../plugin/string')]);

var schema = new Schema(descriptor);
schema.validate(source, function(errors, fields) {
  // error on missing name field
  console.dir(errors);
});
