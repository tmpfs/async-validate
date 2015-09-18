// validate a field is an instanceof a function
var Schema = require('../..')
  , Component = function Component(){}
  , descriptor = {
      type: 'object',
      fields: {
        comp: {type: Component, required: true}
      }
    }
  , source = {comp: {}}
  , schema;

require('../../plugin/all');

schema = new Schema(descriptor);
schema.validate(source, function(err, res) {
  console.dir(res.errors);
});
