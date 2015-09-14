var Schema = require('../../')
  , descriptor = {
    id: {
      foo: 'bar',
      validator: function(cb) {
        console.log(this.foo);
        // if this.value has error condition call this.raise() 
        cb();
      }
    }
  }
  , source = {}
  , schema;

Schema.plugin([
  require('../../plugin/object'),
  require('../../plugin/string'),
  require('../../plugin/util')
]);

var schema = new Schema(descriptor);
schema.validate(source, function(err, res) {});
