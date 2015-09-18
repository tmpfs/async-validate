var expect = require('chai').expect
  , schema = require('../../index');

describe('async-validate:', function() {

  it('should error on invalid object (additional properties)', function(done) {
    var descriptor = {
      address: {
        type: 'object',
        required: true,
        additional: false,
        fields: {
          street: {type: 'string', required: true},
          city: {type: 'string', required: true},
          zip: {type: 'string', required: true, len: 8, message: 'Invalid zip'}
        }
      }
    }
    var source = {
      address: {
        name: 'Oops',
        street: 'Mock St',
        city: 'Mock City',
        zip: '12345678'
      }
    }
    var validator = new schema(descriptor);
    validator.validate(source, function(err, res) {
      var expected = 'extraneous fields (name) found in address';
      expect(res.errors.length).to.eql(1);
      expect(res.errors[0].message).to.eql(expected);
      done();
    });
  });

  it('should validate with no additional properties', function(done) {
    var descriptor = {
      address: {
        type: 'object',
        required: true,
        additional: false,
        fields: {
          street: {type: 'string', required: true},
          city: {type: 'string', required: true},
          zip: {type: 'string', required: true, len: 8, message: 'Invalid zip'}
        }
      }
    }
    var source = {
      address: {
        street: 'Mock St',
        city: 'Mock City',
        zip: '12345678'
      }
    }
    var validator = new schema(descriptor);
    validator.validate(source, function(err, res) {
      expect(err).to.eql(null);
      expect(res).to.eql(null);
      done();
    });
  });

});
