var expect = require('chai').expect
  , Schema = require('../../index')
  , descriptor = require('../fixtures/schema/float');

describe('async-validate:', function() {

  it('should error when a number is not a float', function(done) {
    var schema = new Schema(descriptor);
    schema.validate({ratio: 1618}, function(err, res) {
      expect(res.errors.length).to.eql(1);
      expect(res.errors[0].message).to.eql('ratio is not a float');
      done();
    });
  });

  it('should validate a number is a float', function(done) {
    var schema = new Schema(descriptor);
    schema.validate({ratio: 1.667}, function(err, res) {
      expect(err).to.eql(null);
      expect(res).to.eql(null);
      done();
    });
  });

});
