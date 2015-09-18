// override error message with function
var Schema = require('../..')
  , descriptor = {
      type: 'object',
      fields: {
        name: {
          type: 'string',
          required: true,
          message: function() {
            return this.format(
              'name must be specified (field: %s)', this.field);
          }
        }
      }
    }
  , source = {}
  , schema;

require('../../plugin/all');

schema = new Schema(descriptor);
schema.validate(source, function(err, res) {
  console.dir(res.errors);
});
