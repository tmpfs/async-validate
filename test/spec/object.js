var assert = require('chai').assert;
var schema = require('../../index');

describe("async-validate:", function() {
  it("should error on invalid object (array specified)", function(done) {
    var descriptor = {
      address: {type: "object", required: true}
    }
    var validator = new schema(descriptor);
    validator.validate({address: []}, function(errors, fields) {
      assert.equal(errors.length, 1);
      assert.equal(errors[0].message, "address is not an object");
      done();
    });
  });
  it("should error on invalid object (required but not specified)", function(done) {
    var descriptor = {
      address: {type: "object", required: true}
    }
    var validator = new schema(descriptor);
    validator.validate({}, function(errors, fields) {
      assert.equal(errors.length, 2);
      assert.equal(errors[0].message, "address is required");
      done();
    });
  });
  it("should validate object (empty object)", function(done) {
    var descriptor = {
      address: {type: "object", required: true}
    }
    var validator = new schema(descriptor);
    validator.validate({address: {}}, function(errors, fields) {
      assert.isNull(errors);
      assert.isNull(fields);
      done();
    });
  });
});
