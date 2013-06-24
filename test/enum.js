var util = require('util');
var assert = require('chai').assert;
var schema = require('../index');

suite("Enum validator:", function() {
  test("invalid enum value", function() {
    var descriptor = {
      role: {type: "enum", enum: ['admin', 'user', 'guest']}
    }
    var validator = new schema(descriptor);
    validator.validate({role: "manager"}, function(errors, fields) {
      assert.equal(errors.length, 1);
      assert.equal(errors[0].message, "role must be one of admin, user, guest");
    });
  });
  test("valid enum value", function() {
    var descriptor = {
      role: {type: "enum", enum: ['admin', 'user', 'guest']}
    }
    var validator = new schema(descriptor);
    validator.validate({role: "user"}, function(errors, fields) {
      assert.isNull(errors);
      assert.isNull(fields);
    });
  });
});
