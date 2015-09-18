// validate a field type
var Schema = require('../..')
  , descriptor = {
      type: 'object',
      fields: {
        flag: {type: 'boolean', required: true}
      }
    }
  , source = {flag: 'foo'}
  , schema;

require('../../plugin/all');

schema = new Schema(descriptor);
schema.validate(source, function(err, res) {
  console.dir(res.errors);
});
