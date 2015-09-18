// validate all fields of an object
var Schema = require('../..')
  , descriptor = {
      type: 'object',
      required: true,
      fields: {
        all: {
          match: /./,
          type: 'string'
        }
      }
    }
  , source = {address1: 'foo', address2: 'bar', address3: false}
  , schema;

require('../../plugin/all');

schema = new Schema(descriptor);
schema.validate(source, function(err, res) {
  console.dir(res.errors);
});
