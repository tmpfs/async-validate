// clone default messages
var Schema = require('../..')
  , messages = Schema.clone(require('../../messages'))
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

// change message in place
messages.required = '%s is a required field';

// pass messages as constructor option
schema = new Schema(descriptor, {messages: messages});
schema.validate(source, function(err, res) {
  console.dir(res.errors);
});
