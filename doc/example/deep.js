// validate properties of a nested object
var Schema = require('../..')
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
  , source = {address: {name: '1024c', street: 'Mock St', city: 'Mock City'}}
  , schema;

require('../../plugin/all');

schema = new Schema(descriptor);
schema.validate(source, function(err, res) {
  console.dir(res.errors);
});
