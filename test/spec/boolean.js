var assert = require('chai').assert;
var schema = require('../../index');

describe("async-validate:", function() {
  it("should validate boolean type", function(done) {
    var descriptor = {
      flag: {type: "boolean"},
    }
    var validator = new schema(descriptor);
    validator.validate({flag: "false"}, function(errors, fields) {
      assert.equal(errors.length, 1);
      assert.equal(errors[0].message, "flag is not a boolean");
      done();
    });
  });
  it("should validate boolean pass", function(done) {
    var descriptor = {
      flag: {type: "boolean"},
    }
    var validator = new schema(descriptor);
    validator.validate({flag: true}, function(errors, fields) {
      assert.isNull(errors);
      assert.isNull(fields);
      done();
    });
  });
});
