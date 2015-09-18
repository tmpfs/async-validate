var expect = require('chai').expect
  , Schema = require('../../index')
  , descriptor = require('../fixtures/schema/match')
  , source = {
      nonmatch: 'foo',
      address1: 'foo',
      address2: 'bar',
      address3: false
    };

describe('async-validate:', function() {

  it('should error on invalid expanded property (match)', function(done) {
    var schema = new Schema(descriptor);
    schema.validate(source, function(err, res) {
      expect(res.errors.length).to.eql(1);
      expect(res.errors[0].message).to.eql('address3 is not a string');
      done();
    });
  });

  it('should validate on expanded properties', function(done) {
    var schema = new Schema(descriptor);
    source.address3 = 'qux';
    schema.validate(source, function(err, res) {
      expect(err).to.eql(null);
      expect(res).to.eql(null);
      done();
    });
  });

});
