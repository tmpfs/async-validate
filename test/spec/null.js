var expect = require('chai').expect
  , schema = require('../../index');

function Component(){}

describe("async-validate:", function() {
  var descriptor = {
    value: {
      type: 'null'
    }
  }

  it("should error on non-null value", function(done) {
    var validator = new schema(descriptor);
    validator.validate({value: true}, function(errors, fields) {
      expect(errors.length).to.eql(1);
      expect(errors[0].message).to.eql('value is not null');
      done();
    });
  });

  it("should validate on type null", function(done) {
    var validator = new schema(descriptor);
    validator.validate({value: null}, function(errors, fields) {
      expect(errors).to.eql(null);
      done();
    });
  });

  it("should validate on type null with no value", function(done) {
    var validator = new schema(descriptor);
    validator.validate({}, function(errors, fields) {
      expect(errors).to.eql(null);
      done();
    });
  });

});
