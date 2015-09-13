var Schema = require('../../')
  , descriptor = {
    name: {type: 'string', required: true, whitespace: true}
  }
  , source = {name: '  '}
  , schema;

Schema.plugin([
  require('../../plugin/object'),
  require('../../plugin/string'),
  require('../../plugin/util')
]);

var schema = new Schema(descriptor);
schema.validate(source, function(err, res) {
  // error on name field
  console.dir(res.errors);
});
