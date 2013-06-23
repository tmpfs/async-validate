var util = require('util');
var assert = require('chai').assert;
var schema = require('../index');

suite("Options validation:", function() {
  test("validate multiple errors", function() {
    var descriptor = {
      firstname: {type: "string", required: true},
      surname: {type: "string", required: true}
    }
    var validator = new schema(descriptor);
    validator.validate({}, {first: false}, function(errors, fields) {
      assert.equal(errors.length, 2);
    });
  });
  test("validate fail on first error", function() {
    var descriptor = {
      firstname: {type: "string", required: true},
      surname: {type: "string", required: true}
    }
    var validator = new schema(descriptor);
    validator.validate({}, {first: true}, function(errors, fields) {
      assert.equal(errors.length, 1);
    });
  });
  test("validate single option", function() {
    var descriptor = {
      name: {type: "string", required: true, min: 10, pattern: /^[^-].*$/}
    }
    var validator = new schema(descriptor);
    validator.validate({name: "-name"}, {first: true, single: true}, function(errors, fields) {
      assert.equal(errors.length, 1);
      assert.equal(fields.name.length, 1);
    });
  });
});
