// bail on first error encountered
var Schema = require('../..')
  , descriptor = {
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
  , source = {address: {name: '1024c'}}
  , schema;

require('../../plugin/all');

schema = new Schema(descriptor);
schema.validate(source, {bail: true}, function(err, res) {
  console.dir(res.errors);
});
