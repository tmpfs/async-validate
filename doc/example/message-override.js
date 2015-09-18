// override default error message
var Schema = require('../..')
  , messages = require('../../messages')
  , descriptor = {
      type: 'object',
      fields: {
        name: {
          type: 'string',
          required: true
        }
      }
    }
  , source = {}
  , schema;

require('../../plugin/all');

// change default message in place
messages.required = '%s is a required field';

schema = new Schema(descriptor);
schema.validate(source, function(err, res) {
  console.dir(res.errors);
});
