var assert = require('chai').assert;
var schema = require('../../index');

describe("async-validate:", function() {

  it("should validate a value is a function", function(done) {
    var descriptor = {
      mock: {type: "method"},
    }
    var validator = new schema(descriptor);
    validator.validate({mock: 80}, function(errors, fields) {
      assert.equal(errors.length, 1);
      assert.equal(errors[0].message, "mock is not a method");
      done();
    });
  });

});
