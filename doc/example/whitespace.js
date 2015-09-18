// validate a field as whitespace
var Schema = require('../..')
  , descriptor = {
      type: 'object',
      fields: {
        name: {type: 'string', required: true, whitespace: true}
      }
    }
  , source = {name: '  '}
  , schema;

require('../../plugin/all');

schema = new Schema(descriptor);
schema.validate(source, function(err, res) {
  console.dir(res.errors);
});
