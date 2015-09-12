var assert = require('chai').assert;
var schema = require('../../index');

describe("async-validate:", function() {

  it("should validate a number is a float", function(done) {
    var descriptor = {
      ratio: {type: "float"},
    }
    var validator = new schema(descriptor);
    validator.validate({ratio: 1618}, function(errors, fields) {
      assert.equal(errors.length, 1);
      //console.log(errors[0].message);
      assert.equal(errors[0].message, "ratio is not a float");
      done();
    });
  });

});
