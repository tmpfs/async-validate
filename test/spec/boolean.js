var expect = require('chai').expect
  , Schema = require('../../index');

describe("async-validate:", function() {

  var descriptor = {
    flag: {type: "boolean"},
  }

  it("should error on non-boolean type", function(done) {
    var schema = new Schema(descriptor);
    schema.validate({flag: "false"}, function(errors, fields) {
      expect(errors.length).to.eql(1);
      expect(errors[0].message).to.eql('flag is not a boolean');
      done();
    });
  });

  it("should validate boolean pass", function(done) {
    var schema = new Schema(descriptor);
    schema.validate({flag: true}, function(errors, fields) {
      expect(errors).to.eql(null);
      done();
    });
  });

});
