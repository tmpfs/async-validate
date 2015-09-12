var assert = require('chai').assert;
var schema = require('../../index');

describe("async-validate:", function() {
  it("should transform by stripping whitespace", function(done) {
    var descriptor = {
      name: {
        type: "string",
        required: true, pattern: /^[a-z]+$/,
        transform: function(value) {
          return value.trim();
        }
      }
    }
    var validator = new schema(descriptor);
    var source = {name: " user  "};
    validator.validate(source, function(errors, fields) {
      assert.isNull(errors);
      assert.isNull(fields);
      assert.equal(source.name, "user");
      done();
    });
  });
});
