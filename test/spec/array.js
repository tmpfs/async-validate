var util = require('util');
var assert = require('chai').assert;
var schema = require('../../index');

describe("async-validate:", function() {
  it("should validate array type", function(done) {
    var descriptor = {
      list: {type: "array"},
    }
    var validator = new schema(descriptor);
    validator.validate({list: false}, function(errors, fields) {
      assert.equal(errors.length, 1);
      assert.equal(errors[0].message, "list is not an array");
      done();
    });
  });

  it("should validate array length minimum", function(done) {
    var descriptor = {
      list: {type: "array", min: 2},
    }
    var validator = new schema(descriptor);
    validator.validate({list: [1]}, function(errors, fields) {
      assert.equal(errors.length, 1);
      assert.equal(errors[0].message, "list cannot be less than 2 in length");
      done();
    });
  });
  it("should validate array length maximum", function(done) {
    var descriptor = {
      list: {type: "array", max: 2},
    }
    var validator = new schema(descriptor);
    validator.validate({list: [1,2,3]}, function(errors, fields) {
      assert.equal(errors.length, 1);
      assert.equal(errors[0].message, "list cannot be greater than 2 in length");
      done();
    });
  });
  it("should validate array length range", function(done) {
    var descriptor = {
      list: {type: "array", min: 1, max: 2},
    }
    var validator = new schema(descriptor);
    validator.validate({list: [1,2,3]}, function(errors, fields) {
      assert.equal(errors.length, 1);
      //console.log(errors[0].message);
      assert.equal(errors[0].message, "list must be between 1 and 2 in length");
      done();
    });
  });
});
