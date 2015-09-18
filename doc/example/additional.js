// generate errors when additional fields are present
var Schema = require('../..')
  , opts = {field: 'root'}
  , descriptor = {
      type: 'object',
      additional: false,
      fields: {
        address: {
          type: 'object',
          required: true,
          additional: false,
          fields: {
            street: {type: 'string', required: true},
            city: {type: 'string', required: true},
            zip: {
              type: 'string',
              required: true,
              len: 8,
              message: 'Invalid zip'
            }
          }
        }
      }
    }
  , source = {
      id: 'unknown-field',
      name: 'unknown-field',
      address: {
        name: 'unknown-field',
        street: 'Mock St',
        city: 'Mock City',
        zip: '12345678'
      }
    }
  , schema;

require('../../plugin/all');

schema = new Schema(descriptor);
schema.validate(source, opts, function(err, res) {
  console.dir(res.errors);
});
