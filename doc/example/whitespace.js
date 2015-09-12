var Schema = require('../../')
  , descriptor = {
    name: {type: 'string', required: true, whitespace: true}
  }
  , source = {name: '  '}
  , schema;

Schema.plugin([require('../../plugin/string')]);

var schema = new Schema(descriptor);
schema.validate(source, function(errors, fields) {
  // error on name field
  console.dir(errors);
});
