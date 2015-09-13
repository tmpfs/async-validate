var expect = require('chai').expect
  , Schema = require('../../index');

describe('async-validate:', function() {

  var descriptor = {
    type: 'object',
    additional: false,
    fields: {
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
  }

  it('should error on invalid object (additional properties)', function(done) {
    var opts = {
      // set root source object field name
      field: 'root'
    }
    var source = {
      name: 'Oops',
      address: {
        name: 'Oops',
        street: 'Mock St',
        city: 'Mock City',
        zip: '12345678',
      }
    }

    var validator = new Schema(descriptor);
    validator.validate(source, opts, function(err, res) {
      expect(res.errors.length).to.eql(2);
      expect(res.errors[0].message).to.eql(
        'extraneous fields (name) found in root');
      expect(res.errors[1].message).to.eql(
        'extraneous fields (name) found in address');
      done();
    });
  });

  it('should validate with no additional properties', function(done) {
    var source = {
      address: {
        street: 'Mock St',
        city: 'Mock City',
        zip: '12345678',
      }
    }
    var validator = new Schema(descriptor);
    validator.validate(source, function(err, res) {
      expect(err).to.eql(null);
      expect(res).to.eql(null);
      done();
    });
  });

});
