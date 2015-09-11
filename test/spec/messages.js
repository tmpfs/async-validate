var util = require('util');
var assert = require('chai').assert;
var schema = require('../../index');
var msg = require('../../messages');

describe("async-validate:", function() {

  it("should validate using a custom error message", function(done) {
    var descriptor = {
      name: {type: "string", required: true, message: "Name is required"},
    }
    var validator = new schema(descriptor);
    validator.validate({}, function(errors, fields) {
      assert.equal(errors.length, 1);
      assert.equal(errors[0].message, "Name is required");
      done();
    });
  });

  // quick and dirty clone of the default messages
  var clone = msg.clone();
  // change a message
  clone.required = "%s is a required field";
  it("should validate using custom messages", function(done) {
    var descriptor = {
      name: {type: "string", required: true},
    }
    var validator = new schema(descriptor);
    // assign to the schema
    validator.messages(clone);
    validator.validate({}, function(errors, fields) {
      assert.equal(errors.length, 1);
      assert.equal(errors[0].message, "name is a required field");
      done();
    });
  });
  it("should verify custom error message helper", function(done) {
    var descriptor = {
      name: function(opts ,cb) {
        var errors = opts.errors;
        opts.raise(
          opts.rule, "%s is a required field", opts.rule.field);
        cb(errors);
      }
    }
    var validator = new schema(descriptor);
    validator.validate({}, function(errors, fields) {
      assert.equal(errors.length, 1);
      assert.equal(errors[0].message, "name is a required field");
      done();
    });
  });
});
