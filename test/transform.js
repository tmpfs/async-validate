var util = require('util');
var assert = require('chai').assert;
var schema = require('../index');
var sanitize = require('validator').sanitize;

suite("Transform validator:", function() {
  test("transform by stripping whitespace", function() {
    var descriptor = {
      name: {
        type: "string",
        required: true, pattern: /^[a-z]+$/,
        transform: function(value) {
          return sanitize(value).trim();
        }
      }
    }
    var validator = new schema(descriptor);
    var source = {name: " user  "};
    validator.validate(source, function(errors, fields) {
      assert.isNull(errors);
      assert.isNull(fields);
      assert.equal(source.name, "user");
    });
  });
});
