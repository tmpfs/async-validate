var expect = require('chai').expect
  , Schema = require('../../index')
  , descriptor = require('../fixtures/schema/additional');

describe('async-validate:', function() {

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
        zip: '12345678'
      }
    }

    var schema = new Schema(descriptor);
    schema.validate(source, opts, function(err, res) {
      //console.dir(res);
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
