// validate a field with a plugin rule
var Schema = require('../..')
  , descriptor = {
      type: 'object',
      fields: {
        id: {type: 'id', required: true}
      }
    }
  , source = {id: '-foo'}
  , schema;

require('../../plugin/all');

// create plugin function
function plugin() {
  var pattern = /^[a-z0-9]$/i;
  // create static rule function
  this.main.id = function id(cb) {
    if(!pattern.test(this.value)) {
      this.raise(this.reason('id'), 'invalid id %s', this.value);
    }
    cb();
  }
}

// use plugin
Schema.plugin([plugin]);

schema = new Schema(descriptor);
schema.validate(source, function(err, res) {
  console.dir(res.errors);
});
