// assign a function to a rule
var Schema = require('../..')
  , descriptor = {
      type: 'object',
      fields: {
        id: {
          expected: 'foo',
          test: function(cb) {
            if(this.value !== this.expected) {
              this.raise(
                this.reason('unexpected-id'),
                'id expects %s, got %s',
                this.expected,
                this.value
              ) 
            }
            cb();
          }
        }
      }
    }
  , source = {id: 'qux'}
  , schema;

require('../../plugin/all');

schema = new Schema(descriptor);
schema.validate(source, function(err, res) {
  console.dir(res.errors);
});
