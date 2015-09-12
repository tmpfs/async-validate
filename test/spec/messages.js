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

  // clone of the default messages
  var clone = schema.clone(msg);

  // change a message
  clone.required = "%s is a required field";

  it("should validate using custom messages", function(done) {
    var descriptor = {
      name: {type: "string", required: true},
    }
    var validator = new schema(descriptor);

    // assign updated messages to the schema
    validator.messages(clone);

    validator.validate({}, function(errors, fields) {
      assert.equal(errors.length, 1);
      assert.equal(errors[0].message, "name is a required field");
      done();
    });
  });

  it("should verify custom error message helper", function(done) {
    var descriptor = {
      name: function(cb) {
        this.raise("%s is a required field", this.field);
        cb(this.errors);
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
