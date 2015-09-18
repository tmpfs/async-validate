// validate a field as one of multiple types
var Schema = require('../..')
  , descriptor = {
      type: 'object',
      fields: {
        flag: {type: ['boolean', Boolean], required: true}
      }
    }
  , source = {flag: 'foo'}
  , schema;

require('../../plugin/all');

schema = new Schema(descriptor);
schema.validate(source, function(err, res) {
  console.dir(res.errors);
});
