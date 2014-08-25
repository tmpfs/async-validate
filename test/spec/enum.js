var util = require('util');
var assert = require('chai').assert;
var schema = require('../../index');

describe("async-validate:", function() {
  it("should error on invalid enum value", function(done) {
    var descriptor = {
      role: {type: "enum", enum: ['admin', 'user', 'guest']}
    }
    var validator = new schema(descriptor);
    validator.validate({role: "manager"}, function(errors, fields) {
      assert.equal(errors.length, 1);
      assert.equal(errors[0].message, "role must be one of admin, user, guest");
      done();
    });
  });
  it("should validate enum value", function(done) {
    var descriptor = {
      role: {type: "enum", enum: ['admin', 'user', 'guest']}
    }
    var validator = new schema(descriptor);
    validator.validate({role: "user"}, function(errors, fields) {
      assert.isNull(errors);
      assert.isNull(fields);
      done();
    });
  });
});
