// assign a function as a rule
var Schema = require('../..')
  , reserved = ['foo']
  , descriptor = {
      type: 'object',
      fields: {
        id: function(cb) {
          if(~reserved.indexOf(this.value)) {
            this.raise('%s is a reserved id', this.value); 
          }
          cb();
        }
      }
    }
  , source = {id: 'foo'}
  , schema;

require('../../plugin/all');

schema = new Schema(descriptor);
schema.validate(source, function(err, res) {
  console.dir(res.errors);
});
