var expect = require('chai').expect
  , Schema = require('../../index');

describe("async-validate:", function() {

  var descriptor = {
    mock: {type: "method"},
  }

  it("should error on value that is not a function", function(done) {
    var schema = new Schema(descriptor);
    schema.validate({mock: 80}, function(errors, fields) {
      expect(errors.length).to.eql(1);
      expect(errors[0].message).to.eql('mock is not a method');
      done();
    });
  });

  it("should validate function type", function(done) {
    var schema = new Schema(descriptor);
    schema.validate({mock: function(){}}, function(errors, fields) {
      expect(errors).to.eql(null);
      done();
    });
  });

});
