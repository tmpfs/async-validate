// validate a field has a maximum length
var Schema = require('../..')
  , descriptor = {
      type: 'object',
      fields: {
        func: {type: 'function', required: true, max: 1}
      }
    }
  , source = {
      func: function noop(foo, bar){
        foo();
        bar();
      }
    }
  , schema;

require('../../plugin/all');

schema = new Schema(descriptor);
schema.validate(source, function(err, res) {
  console.dir(res.errors);
});
