var util = require('util');
var assert = require('chai').assert;
var schema = require('../../index');

describe("async-validate:", function() {
  it("should validate regexp type (positive lookbehind unsupported)", function(done) {
    var descriptor = {
      re: {type: "regexp"},
    }
    var validator = new schema(descriptor);
    validator.validate({re: "(?<=(category=))[a-z-]+"}, function(errors, fields) {
      assert.equal(errors.length, 1);
      assert.equal(errors[0].message, "re is not a valid regexp");
      done();
    });
  });
  it("should validate regexp pass", function(done) {
    var descriptor = {
      re: {type: "regexp"},
    }
    var validator = new schema(descriptor);
    validator.validate({re: "^[a-z]+$"}, function(errors, fields) {
      assert.isNull(errors);
      assert.isNull(fields);
      done();
    });
  });
  it("should validate native regexp pass", function(done) {
    var descriptor = {
      re: {type: "regexp"},
    }
    var validator = new schema(descriptor);
    validator.validate({re: /^[a-z]+$/}, function(errors, fields) {
      assert.isNull(errors);
      assert.isNull(fields);
      done();
    });
  });
});
