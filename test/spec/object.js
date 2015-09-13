var expect = require('chai').expect
  , Schema = require('../../index');

describe("async-validate:", function() {

  var descriptor = {
    address: {type: "object", required: true}
  }

  it("should error on invalid object (array specified)", function(done) {
    var schema = new Schema(descriptor);
    schema.validate({address: []}, function(err, res) {
      expect(res.errors.length).to.eql(1);
      expect(res.errors[0].message).to.eql('address is not an object');
      done();
    });
  });

  it("should error on invalid object (required but not specified)",
    function(done) {
      var schema = new Schema(descriptor);
      schema.validate({}, function(err, res) {
        expect(res.errors.length).to.eql(1);
        expect(res.errors[0].message).to.eql('address is required');
        done();
      });
    }
  );

  it("should validate object (empty object)", function(done) {
    var schema = new Schema(descriptor);
    schema.validate({address: {}}, function(err, res) {
      expect(err).to.eql(null);
      expect(res).to.eql(null);
      done();
    });
  });

});
