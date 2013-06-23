var util = require('util');
var assert = require('chai').assert;
var schema = require('../index');
var ValidationError = schema.error;

suite("Multiple validation:", function() {
  test("validate using multiple validation rules for a field", function() {
    var descriptor = {
      email: [
        {type: "string", required: true},
        {pattern: schema.pattern.email}
      ]
    }
    var validator = new schema(descriptor);
    validator.validate({address: "joe@example"}, function(errors, fields) {
      assert.equal(errors.length, 2);
      assert.equal(errors[0].message, "Field email is required");
      assert.equal(errors[1].message,
        "Field email value undefined does not match pattern "
        + schema.pattern.email);
    });
  });
  test("validate using multiple validation rules for a field single failure", function() {
    var descriptor = {
      email: [
        {type: "string", required: true},
        {pattern: schema.pattern.email}
      ]
    }
    var validator = new schema(descriptor);
    validator.validate({email: "joe@example"}, function(errors, fields) {
      assert.equal(errors.length, 1);
      assert.equal(errors[0].message,
        "Field email value joe@example does not match pattern "
        + schema.pattern.email);
    });
  });
});
