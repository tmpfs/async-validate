// validate a field has a length within a range
var Schema = require('../..')
  , descriptor = {
      type: 'object',
      fields: {
        func: {type: 'function', required: true, min: 1, max: 2}
      }
    }
  , source = {
      func: function noop(foo, bar, qux){
        foo();
        bar();
        qux();
      }
    }
  , schema;

require('../../plugin/all');

schema = new Schema(descriptor);
schema.validate(source, function(err, res) {
  console.dir(res.errors);
});
