var util = require('util');
var assert = require('chai').assert;
var schema = require('../../index');
var msg = require('../../messages');

describe("async-validate:", function() {

  it("should validate using a custom error message as object", function(done) {
    var descriptor = {
      num: {
        type: "number", min: 0, max: 10,
        message: {
          min: 'Number may not be below zero',
          max: 'Number may not be above 10',
        }
      }
    }
    var validator = new schema(descriptor);
    validator.validate({num: -1}, function(errors, fields) {
      assert.equal(errors.length, 1);
      assert.equal(errors[0].message, "Number may not be below zero");
      done();
    });
  });

  it("should validate using a custom error message as object", function(done) {
    var descriptor = {
      num: {
        type: "number", min: 0, max: 10,
        message: {
          min: 'Number may not be below zero',
          max: 'Number may not be above 10',
        }
      }
    }
    var validator = new schema(descriptor);
    validator.validate({num: 11}, function(errors, fields) {
      assert.equal(errors.length, 1);
      assert.equal(errors[0].message, "Number may not be above 10");
      done();
    });
  });

});
