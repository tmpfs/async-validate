var assert = require('chai').assert;
var schema = require('../index');

suite("String validation:", function() {
  test("validate a required string field", function() {
    var descriptor = {
      name: {type: "string", required: true}
    }
    var validator = new schema(descriptor);
    validator.validate({noname: "field"}, function(errors) {
      assert.equal(errors.length, 1);
      assert.equal(errors[0].message, "Field name is required");
    });
  });
  test("validate a field of type string is of the correct type", function() {
    var descriptor = {
      name: {type: "string"}
    }
    var validator = new schema(descriptor);
    validator.validate({name: 10}, function(errors) {
      assert.equal(errors.length, 1);
      assert.equal(errors[0].message, "Field name is not a string");
    });
  });
  test("validate a required string field with minimum length", function() {
    var descriptor = {
      "name": {type: "string", required: true, min: 8}
    }
    var validator = new schema(descriptor);
    validator.validate({name: "field"}, function(errors) {
      assert.equal(errors.length, 1);
      assert.equal(errors[0].message, "Field name must be at least 8 characters");
      //console.log("Test got callback %j", errors[0].message);
    });
  });
});
