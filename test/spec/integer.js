var assert = require('chai').assert;
var schema = require('../../index');

describe("async-validate:", function() {

  it("should validate a number is an integer", function(done) {
    var descriptor = {
      port: {type: "integer"},
    }
    var validator = new schema(descriptor);
    validator.validate({port: 1.618}, function(errors, fields) {
      assert.equal(errors.length, 1);
      assert.equal(errors[0].message, "port is not an integer");
      done();
    });
  });

});
