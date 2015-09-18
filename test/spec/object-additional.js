var expect = require('chai').expect
  , Schema = require('../../index')
  , descriptor = require('../fixtures/schema/object-additional');

describe('async-validate:', function() {

  it('should error on invalid object (additional properties)', function(done) {
    var source = {
      address: {
        name: 'Oops',
        street: 'Mock St',
        city: 'Mock City',
        zip: '12345678'
      }
    }
    var schema = new Schema(descriptor);
    schema.validate(source, function(err, res) {
      var expected = 'extraneous fields (name) found in address';
      expect(res.errors.length).to.eql(1);
      expect(res.errors[0].message).to.eql(expected);
      done();
    });
  });

  it('should validate with no additional properties', function(done) {
    var source = {
      address: {
        street: 'Mock St',
        city: 'Mock City',
        zip: '12345678'
      }
    }
    var schema = new Schema(descriptor);
    schema.validate(source, function(err, res) {
      expect(err).to.eql(null);
      expect(res).to.eql(null);
      done();
    });
  });

});
