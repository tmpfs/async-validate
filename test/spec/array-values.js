var util = require('util');
var assert = require('chai').assert;
var schema = require('../../index');

describe("async-validate:", function() {

  it("should validate array values", function(done) {
    var descriptor = {
      list: {
        type: "array",
        values: {
          type: 'integer',
          message: function(message, parameters) {
            parameters[0] = this.value;
            return this.format.apply(this, [message].concat(parameters));
          }
        }
      },
    }
    var validator = new schema(descriptor);
    validator.validate({list: [1,2,3,'foo']}, function(errors, fields) {
      assert.equal(errors.length, 1);
      assert.equal(errors[0].message, "foo is not an integer");
      done();
    });
  });

});
