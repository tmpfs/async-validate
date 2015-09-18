// validate a field with multiple rules
var Schema = require('../..')
  , data = {bar: 'qux'}
  , descriptor = {
      type: 'object',
      fields: {
        id: [
          {type: 'string', required: true},
          function exists(cb) {
            if(!data[this.value]) {
              this.raise(
                this.reason('missing-id'),
                'id %s does not exist', this.value);
            }
            cb();
          }
        ]
      }
    }
  , source = {id: 'foo'}
  , schema;

require('../../plugin/all');

schema = new Schema(descriptor);
schema.validate(source, function(err, res) {
  console.dir(res.errors);
});
