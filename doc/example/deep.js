// validate properties of a nested object
var Schema = require('../..')
  , descriptor = {
      address: {
        type: 'object',
        fields: {
          number: {type: 'string', required: true},
          street: {type: 'string', required: true},
          city: {type: 'string', required: true},
          zip: {type: 'string', required: true}
        }
      }
    }
  , source = {address: {number: '1', street: 'Mock St', city: 'Mock City'}}
  , schema;

require('../../plugin/all');

schema = new Schema(descriptor);
schema.validate(source, function(err, res) {
  console.dir(res.errors);
});
