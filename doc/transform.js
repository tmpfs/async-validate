var Schema = require('..')
  , descriptor = {
    name: {
      type: "string",
      required: true, pattern: /^[a-z]+$/,
      transform: function(value) {
        return value.trim();
      }
    }
  }
  , schema = new Schema(descriptor)
  , source = {name: " user  "};

Schema.plugin([
  require('../plugin/core'),
  require('../plugin/string')]);

schema.validate(source, function(err, res) {
  console.dir(source.name);
});
