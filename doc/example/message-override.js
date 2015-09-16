// override default error message
var Schema = require('../..')
  , messages = require('../../messages')
  , descriptor = {
      name: {
        type: 'string',
        required: true
      }
    }
  , source = {}
  , schema;

require('../../plugin/all');

// change message
messages.required = '%s is a required field';

schema = new Schema(descriptor);
schema.validate(source, function(err, res) {
  console.dir(res.errors);
});
