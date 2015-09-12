var assert = require('chai').assert;
var schema = require('../../index');

describe("async-validate:", function() {
  it("should error on invalid string length", function(done) {
    var descriptor = {
      name: {type: "string", len: 10},
    }
    var validator = new schema(descriptor);
    validator.validate({name: "user"}, function(errors, fields) {
      assert.equal(errors.length, 1);
      assert.equal(errors[0].message, "name must be exactly 10 characters");
      done();
    });
  });
  it("should error on invalid number length", function(done) {
    var descriptor = {
      port: {type: "number", len: 80},
    }
    var validator = new schema(descriptor);
    validator.validate({port: 8080}, function(errors, fields) {
      assert.equal(errors.length, 1);
      assert.equal(errors[0].message, "port must equal 80");
      done();
    });
  });
  it("should error on invalid array length", function(done) {
    var descriptor = {
      roles: {type: "array", len: 2},
    }
    var validator = new schema(descriptor);
    validator.validate({roles: ["user"]}, function(errors, fields) {
      assert.equal(errors.length, 1);
      assert.equal(errors[0].message, "roles must be exactly 2 in length");
      done();
    });
  });
  it("should validate string length", function(done) {
    var descriptor = {
      name: {type: "string", len: 8},
    }
    var validator = new schema(descriptor);
    validator.validate({name: "username"}, function(errors, fields) {
      assert.isNull(errors);
      assert.isNull(fields);
      done();
    });
  });
  it("should validiate number length", function(done) {
    var descriptor = {
      port: {type: "number", len: 80},
    }
    var validator = new schema(descriptor);
    validator.validate({port: 80}, function(errors, fields) {
      assert.isNull(errors);
      assert.isNull(fields);
      done();
    });
  });
  it("should validate array length", function(done) {
    var descriptor = {
      roles: {type: "array", len: 2},
    }
    var validator = new schema(descriptor);
    validator.validate({roles: ["user", "admin"]}, function(errors, fields) {
      assert.isNull(errors);
      assert.isNull(fields);
      done();
    });
  });
});
