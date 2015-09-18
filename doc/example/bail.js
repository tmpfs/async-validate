// bail on first error encountered
var Schema = require('../..')
  , opts = {bail: true}
  , descriptor = {
      type: 'object',
      fields: {
        address: {
          type: 'object',
          fields: {
            name: {type: 'string', required: true},
            street: {type: 'string', required: true},
            city: {type: 'string', required: true},
            zip: {type: 'string', required: true}
          }
        }
      }
    }
  , source = {address: {name: '1024c'}}
  , schema;

require('../../plugin/all');

schema = new Schema(descriptor);
schema.validate(source, opts, function(err, res) {
  console.dir(res.errors);
});
