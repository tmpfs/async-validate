var expect = require('chai').expect
  , Schema = require('../../index');

describe("async-validate:", function() {

  var descriptor = {
    port: {type: "integer"},
  }

  it("should error on number as an integer", function(done) {
    var schema = new Schema(descriptor);
    schema.validate({port: 1.618}, function(errors, fields) {
      expect(errors.length).to.eql(1);
      expect(errors[0].message).to.eql('port is not an integer');
      done();
    });
  });

  it("should validate integer type", function(done) {
    var schema = new Schema(descriptor);
    schema.validate({port: 2048}, function(errors, fields) {
      expect(errors).to.eql(null);
      done();
    });
  });

});
