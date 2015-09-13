var schema = require('..')
  , descriptor = {
    name: {
      type: "string",
      required: true, pattern: /^[a-z]+$/,
      transform: function(value) {
        return value.trim();
      }
    }
  }
  , validator = new schema(descriptor)
  , source = {name: " user  "};

schema.plugin([require('../plugin/string')]);

validator.validate(source, function(err, res) {
  console.dir(source.name);
});
