// validate a field as matching a pattern
var Schema = require('../..')
  , descriptor = {
      name: {type: 'string', required: true, pattern: /^[a-z0-9]+$/i}
    }
  , source = {name: '-name'}
  , schema;

require('../../plugin/all');

schema = new Schema(descriptor);
schema.validate(source, function(err, res) {
  console.dir(res.errors);
});
