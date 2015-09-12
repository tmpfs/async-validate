var assert = require('chai').assert;
var schema = require('../../index');

describe("async-validate:", function() {
  it("should validate multiple errors", function(done) {
    var descriptor = {
      firstname: {type: "string", required: true},
      surname: {type: "string", required: true}
    }
    var validator = new schema(descriptor);
    validator.validate({}, {first: false}, function(errors, fields) {
      assert.equal(errors.length, 2);
      done();
    });
  });
  it("should validate keys option", function(done) {
    var descriptor = {
      firstname: {type: "string", required: true},
      surname: {type: "string", required: true}
    }
    var validator = new schema(descriptor);
    validator.validate({}, {keys: ["firstname"]}, function(errors, fields) {
      assert.equal(errors.length, 1);
      done();
    });
  });
  it("should validate fail on first error", function(done) {
    var descriptor = {
      firstname: {type: "string", required: true},
      surname: {type: "string", required: true}
    }
    var validator = new schema(descriptor);
    validator.validate({}, {first: true}, function(errors, fields) {
      assert.equal(errors.length, 1);
      done();
    });
  });
  it("should validate single option", function(done) {
    var descriptor = {
      name: {type: "string", required: true, min: 10, pattern: /^[^-].*$/}
    }
    var validator = new schema(descriptor);
    validator.validate({name: "-name"}, {first: true, single: true}, function(errors, fields) {
      assert.equal(errors.length, 1);
      assert.equal(fields.name.length, 1);
      done();
    });
  });
});
