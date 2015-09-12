var util = require('util');
var assert = require('chai').assert;
var schema = require('../../index');

describe("async-validate:", function() {

  it("should validate a value is a number", function(done) {
    var descriptor = {
      port: {type: "number"},
    }
    var validator = new schema(descriptor);
    validator.validate({port: "80"}, function(errors, fields) {
      assert.equal(errors.length, 1);
      assert.equal(errors[0].message, "port is not a number");
      done();
    });
  });
  it("should validate a number is greater than a minimum value", function(done) {
    var descriptor = {
      port: {type: "number", min: 8080},
    }
    var validator = new schema(descriptor);
    validator.validate({port: 80}, function(errors, fields) {
      assert.equal(errors.length, 1);
      assert.equal(errors[0].message, "port cannot be less than 8080");
      done();
    });
  });
  it("should validate a number is greater than a minimum value", function(done) {
    var descriptor = {
      port: {type: "number", max: 80},
    }
    var validator = new schema(descriptor);
    validator.validate({port: 8080}, function(errors, fields) {
      assert.equal(errors.length, 1);
      assert.equal(errors[0].message, "port cannot be greater than 80");
      done();
    });
  });
  it("should validate a number is greater than a minimum value", function(done) {
    var descriptor = {
      port: {type: "number", min: 80, max: 1024},
    }
    var validator = new schema(descriptor);
    validator.validate({port: 8080}, function(errors, fields) {
      assert.equal(errors.length, 1);
      assert.equal(errors[0].message, "port must be between 80 and 1024");
      done();
    });
  });

});
