// use a placeholder to set a default value
var Schema = require('../..')
  , descriptor = {
      type: 'object',
      fields: {
        list: {
          type: 'array',
          values: {type: 'integer'},
          placeholder: function() {
            return []; 
          }
        }
      }
    }
  , source = {}
  , schema;

require('../../plugin/all');

schema = new Schema(descriptor);
schema.validate(source, function() {
  console.dir(source);
});
