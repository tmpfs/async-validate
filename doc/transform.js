var Schema = require('..')
  , descriptor = {
      type: 'object',
      fields: {
        name: {
          type: "string",
          required: true, pattern: /^[a-z]+$/,
          transform: function(value) {
            return value.trim();
          }
        }
      }
    }
  , schema = new Schema(descriptor)
  , source = {name: " user  "};

Schema.plugin([
  require('../plugin/object'),
  require('../plugin/string'),
  require('../plugin/util')
]);

schema.validate(source, function() {
  console.dir(source.name);
});
