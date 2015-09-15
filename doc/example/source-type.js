// validate the type of the source object
var Schema = require('../..')
  , descriptor = {type: 'object'}
  , source = 'foo'
  , schema;

require('../../plugin/all');

schema = new Schema(descriptor);
schema.validate(source, function(err, res) {
  console.dir(res.errors);
});
