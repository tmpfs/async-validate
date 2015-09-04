var util = require('util');
var assert = require('chai').assert;
var schema = require('../../index');
var ValidationError = schema.ValidationError;
var std = require('../../std-rules')

describe("async-validate:", function(done) {
  it("should validate using multiple validation rules for a field", function(done) {
    var descriptor = {
      email: [
        {type: "string", required: true},
        {pattern: std.pattern.email, required: true}
      ]
    }
    var validator = new schema(descriptor);
    validator.validate({address: "joe@example"}, function(errors, fields) {
      assert.equal(errors.length, 2);
      assert.equal(errors[0].message, "email is required");
      assert.equal(errors[1].message,
        "email value undefined does not match pattern "
        + std.pattern.email);
      done();
    });
  });
  it("should validate using multiple validation rules for a field single failure", function(done) {
    var descriptor = {
      email: [
        {type: "string", required: true},
        {pattern: std.pattern.email}
      ]
    }
    var validator = new schema(descriptor);
    validator.validate({email: "user@example"}, function(errors, fields) {
      assert.equal(errors.length, 1);
      assert.equal(errors[0].message,
        "email value user@example does not match pattern "
        + std.pattern.email);
      done();
    });
  });
  it("should validate using multiple validation rules with a validation function", function(done) {
    var descriptor = {
      email: [
        std.email,
        function(descriptor, value, callback, values) {
          var errors = [];
          var email = "user@example.com";
          if(value == email) {
            errors.push(new ValidationError(
              util.format("Email address %s already exists", email)));
          }
          callback(errors);
        }
      ]
    }
    var validator = new schema(descriptor);
    validator.validate({email: "user@example.com"}, function(errors, fields) {
      assert.equal(errors.length, 1);
      assert.equal(errors[0].message,
        "Email address user@example.com already exists");
      done();
    });
  });
});
