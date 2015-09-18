// validate a field has a minimum length
var Schema = require('../..')
  , descriptor = {
      type: 'object',
      fields: {
        func: {type: 'function', required: true, min: 1}
      }
    }
  , source = {func: function noop(){}}
  , schema;

require('../../plugin/all');

schema = new Schema(descriptor);
schema.validate(source, function(err, res) {
  console.dir(res.errors);
});
