var util = require('util');
var assert = require('chai').assert;
var schema = require('../index');

suite("RegExp validation:", function() {
  test("validate regexp type (positive lookbehind unsupported)", function() {
    var descriptor = {
      re: {type: "regexp"},
    }
    var validator = new schema(descriptor);
    validator.validate({re: "(?<=(category=))[a-z-]+"}, function(errors, fields) {
      assert.equal(errors.length, 1);
      assert.equal(errors[0].message, "re is not a valid regexp");
    });
  });
  test("validate regexp pass", function() {
    var descriptor = {
      re: {type: "regexp"},
    }
    var validator = new schema(descriptor);
    validator.validate({re: "^[a-z]+$"}, function(errors, fields) {
      assert.isNull(errors);
      assert.isNull(fields);
    });
  });
  test("validate native regexp pass", function() {
    var descriptor = {
      re: {type: "regexp"},
    }
    var validator = new schema(descriptor);
    validator.validate({re: /^[a-z]+$/}, function(errors, fields) {
      assert.isNull(errors);
      assert.isNull(fields);
    });
  });
});
