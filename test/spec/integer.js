var expect = require('chai').expect
  , Schema = require('../../index')
  , descriptor = require('../fixtures/schema/integer');

describe('async-validate:', function() {

  it('should error on number not an integer', function(done) {
    var schema = new Schema(descriptor);
    schema.validate({port: 1.618}, function(err, res) {
      expect(res.errors.length).to.eql(1);
      expect(res.errors[0].message).to.eql('port is not an integer');
      done();
    });
  });

  it('should validate integer type', function(done) {
    var schema = new Schema(descriptor);
    schema.validate({port: 2048}, function(err, res) {
      expect(err).to.eql(null);
      expect(res).to.eql(null);
      done();
    });
  });

});
