var expect = require('chai').expect
  , Schema = require('../../index');

describe("async-validate:", function() {

  var descriptor = {
    ratio: {type: "float"},
  }

  it("should error when a number is not a float", function(done) {
    var schema = new Schema(descriptor);
    schema.validate({ratio: 1618}, function(errors, fields) {
      expect(errors.length).to.eql(1);
      expect(errors[0].message).to.eql('ratio is not a float');
      done();
    });
  });

  it("should validate a number is a float", function(done) {
    var schema = new Schema(descriptor);
    schema.validate({ratio: 1.667}, function(errors, fields) {
      expect(errors).to.eql(null);
      done();
    });
  });

});
