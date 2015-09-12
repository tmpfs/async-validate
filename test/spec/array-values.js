var expect = require('chai').expect
  , Schema = require('../../index');

// an error message with the array index is not very useful
// in this instance use the value instead
function value(message, parameters) {
  parameters[0] = this.value;
  return this.format.apply(this, [message].concat(parameters));
}

describe("async-validate:", function() {

  var descriptor = {
    list: {
      type: "array",
      values: {
        type: 'integer',
        message: value
      }
    },
  }

  it("should error on invalid array value type", function(done) {
    var validator = new Schema(descriptor);
    validator.validate({list: [1,2,3,'foo']}, function(errors, fields) {
      expect(errors.length).to.eql(1);
      expect(errors[0].message).to.eql("foo is not an integer");
      done();
    });
  });

  it("should validate array values", function(done) {
    var validator = new Schema(descriptor);
    validator.validate({list: [1,2,3]}, function(errors, fields) {
      expect(errors).to.eql(null);
      done();
    });
  });

  it("should validate array values with empty array", function(done) {
    var validator = new Schema(descriptor);
    validator.validate({list: []}, function(errors, fields) {
      expect(errors).to.eql(null);
      done();
    });
  });

  it("should validate array values with no field", function(done) {
    var validator = new Schema(descriptor);
    validator.validate({}, function(errors, fields) {
      expect(errors).to.eql(null);
      done();
    });
  });

  it("should ignore validation with empty array as values", function(done) {
    var descriptor = {
      list: {
        type: "array",
        values: []
      },
    }
    var validator = new Schema(descriptor);
    validator.validate({list: [1,2,3, 'foo']}, function(errors, fields) {
      expect(errors).to.eql(null);
      done();
    });
  });

  it("should error on invalid array value types", function(done) {
    var descriptor = {
      list: {
        type: "array",
        values: [
          {type: 'integer', message: value},
          {type: 'string', message: value},
          {type: 'float', message: value}
        ]
      },
    }
    var validator = new Schema(descriptor);
    validator.validate({list: [16,'foo', 12]}, function(errors, fields) {
      expect(errors.length).to.eql(1);
      expect(errors[0].message).to.eql("12 is not a float");
      done();
    });
  });

});
