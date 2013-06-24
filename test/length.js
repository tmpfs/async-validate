var util = require('util');
var assert = require('chai').assert;
var schema = require('../index');

suite("Length validator:", function() {
  test("invalid string length", function() {
    var descriptor = {
      name: {type: "string", len: 10},
    }
    var validator = new schema(descriptor);
    validator.validate({name: "user"}, function(errors, fields) {
      assert.equal(errors.length, 1);
      assert.equal(errors[0].message, "name must be exactly 10 characters");
    });
  });
  test("invalid number length", function() {
    var descriptor = {
      port: {type: "number", len: 80},
    }
    var validator = new schema(descriptor);
    validator.validate({port: 8080}, function(errors, fields) {
      assert.equal(errors.length, 1);
      assert.equal(errors[0].message, "port must equal 80");
    });
  });
  test("invalid array length", function() {
    var descriptor = {
      roles: {type: "array", len: 2},
    }
    var validator = new schema(descriptor);
    validator.validate({roles: ["user"]}, function(errors, fields) {
      assert.equal(errors.length, 1);
      assert.equal(errors[0].message, "roles must be exactly 2 in length");
    });
  });
  test("valid string length", function() {
    var descriptor = {
      name: {type: "string", len: 8},
    }
    var validator = new schema(descriptor);
    validator.validate({name: "username"}, function(errors, fields) {
      assert.isNull(errors);
      assert.isNull(fields);
    });
  });
  test("valid number length", function() {
    var descriptor = {
      port: {type: "number", len: 80},
    }
    var validator = new schema(descriptor);
    validator.validate({port: 80}, function(errors, fields) {
      assert.isNull(errors);
      assert.isNull(fields);
    });
  });
  test("valid array length", function() {
    var descriptor = {
      roles: {type: "array", len: 2},
    }
    var validator = new schema(descriptor);
    validator.validate({roles: ["user", "admin"]}, function(errors, fields) {
      assert.isNull(errors);
      assert.isNull(fields);
    });
  });
});
