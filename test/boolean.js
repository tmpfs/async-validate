var util = require('util');
var assert = require('chai').assert;
var schema = require('../index');

suite("Boolean validation:", function() {
  test("validate boolean type", function() {
    var descriptor = {
      flag: {type: "boolean"},
    }
    var validator = new schema(descriptor);
    validator.validate({flag: "false"}, function(errors, fields) {
      assert.equal(errors.length, 1);
      assert.equal(errors[0].message, "flag is not a boolean");
    });
  });
  test("validate boolean type", function() {
    var descriptor = {
      flag: {type: "boolean"},
    }
    var validator = new schema(descriptor);
    validator.validate({flag: true}, function(errors, fields) {
      assert.isNull(errors);
      assert.isNull(fields);
    });
  });
});
