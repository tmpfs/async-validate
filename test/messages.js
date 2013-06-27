var util = require('util');
var assert = require('chai').assert;
var schema = require('../index');

suite("Custom message validation:", function() {
  test("validate using a custom error message", function() {
    var descriptor = {
      name: {type: "string", required: true, message: "Name is required"},
    }
    var validator = new schema(descriptor);
    validator.validate({}, function(errors, fields) {
      assert.equal(errors.length, 1);
      assert.equal(errors[0].message, "Name is required");
    });
  });

  // quick and dirty clone of the default messages
  var clone = schema.messages.clone();
  // change a message
  clone.required = "%s is a required field";
  test("validate using custom messages", function() {
    var descriptor = {
      name: {type: "string", required: true},
    }
    var validator = new schema(descriptor);
    // assign to the schema
    validator.messages(clone);
    validator.validate({}, function(errors, fields) {
      assert.equal(errors.length, 1);
      assert.equal(errors[0].message, "name is a required field");
    });
  });
  test("verify custom error message helper", function() {
    var descriptor = {
      name: function(rule, value, callback, source, options) {
        var errors = options.error(rule, "%s is a required field", rule.field);
        callback(errors);
      }
    }
    var validator = new schema(descriptor);
    validator.validate({}, function(errors, fields) {
      assert.equal(errors.length, 1);
      assert.equal(errors[0].message, "name is a required field");
    });
  });
});
