var util = require('util');
var assert = require('chai').assert;
var schema = require('../index');

suite("Custom message validation:", function() {
  test("validate using a custom error message", function() {
    var descriptor = {
      name: {type: "string", required: true, message: "Name is required"},
    }
    var validator = new schema(descriptor);
    validator.validate({}, function(errors, fields) {
      assert.equal(errors.length, 1);
      assert.equal(errors[0].message, "Name is required");
    });
  });
});
