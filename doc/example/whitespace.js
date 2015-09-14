var Schema = require('../..')
  , descriptor = {
    name: {type: 'string', required: true, whitespace: true}
  }
  , source = {name: '  '}
  , schema;

require('../../plugin/all');

schema = new Schema(descriptor);
schema.validate(source, function(err, res) {
  console.dir(res.errors);
});
