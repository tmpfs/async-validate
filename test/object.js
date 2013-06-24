var util = require('util');
var assert = require('chai').assert;
var schema = require('../index');

suite("Object validator:", function() {
  test("invalid object (array specified)", function() {
    var descriptor = {
      address: {type: "object", required: true}
    }
    var validator = new schema(descriptor);
    validator.validate({address: []}, function(errors, fields) {
      assert.equal(errors.length, 1);
      //console.log(errors[0].message);
      assert.equal(errors[0].message, "address is not an object");
    });
  });
  test("invalid object (required but not specified)", function() {
    var descriptor = {
      address: {type: "object", required: true}
    }
    var validator = new schema(descriptor);
    validator.validate({}, function(errors, fields) {
      assert.equal(errors.length, 1);
      assert.equal(errors[0].message, "address is required");
    });
  });
  test("valid object (empty object)", function() {
    var descriptor = {
      address: {type: "object", required: true}
    }
    var validator = new schema(descriptor);
    validator.validate({address: {}}, function(errors, fields) {
      assert.isNull(errors);
      assert.isNull(fields);
    });
  });
});
