var expect = require('chai').expect
  , Schema = require('../../index')
  , descriptor = require('../fixtures/schema/regexp');

describe("async-validate:", function() {

  it("should error on regexp string (positive lookbehind unsupported)",
    function(done) {
      var schema = new Schema(descriptor)
        , source = {re: "(?<=(category=))[a-z-]+"};
      schema.validate(source, function(err, res) {
        expect(res.errors.length).to.eql(1);
        expect(res.errors[0].message).to.eql('re is not a valid regexp');
        done();
      });
    }
  );

  it("should validate valid regexp string", function(done) {
    var schema = new Schema(descriptor);
    schema.validate({re: "^[a-z]+$"}, function(err, res) {
      expect(err).to.eql(null);
      expect(res).to.eql(null);
      done();
    });
  });

  it("should validate native regexp instance", function(done) {
    var schema = new Schema(descriptor);
    schema.validate({re: /^[a-z]+$/}, function(err, res) {
      expect(err).to.eql(null);
      expect(res).to.eql(null);
      done();
    });
  });

});
