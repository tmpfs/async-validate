var expect = require('chai').expect
  , Schema = require('../../index')
  , descriptor = require('../fixtures/schema/deep')
  , required = require('../fixtures/schema/deep-required')
  , details = require('../fixtures/schema/deep-details')
  , arrayFields = require('../fixtures/schema/deep-array')
  , deepObject = require('../fixtures/schema/deep-object');

describe('async-validate:', function() {

  it('should error on invalid deep rule (required/no matching property)',
    function(done) {
      var schema = new Schema(required);
      schema.validate({}, function(err, res) {
        expect(res.errors.length).to.eql(1);
        expect(res.errors[0].message).to.eql('address is required');
        done();
      });
    }
  );

  it('should error on invalid deep rule (required and failure on deep rule)',
    function(done) {
      var schema = new Schema(details);
      schema.validate({ address: {} }, function(err, res) {
        expect(res.errors.length).to.eql(4);
        expect(res.errors[0].message).to.eql('name is required');
        expect(res.errors[1].message).to.eql('street is required');
        expect(res.errors[2].message).to.eql('city is required');
        expect(res.errors[3].message).to.eql('invalid zip');
        done();
      });
    }
  );

  it('should error on deep rule (array type length mismatch)', function(done) {
    var schema = new Schema(arrayFields);
    schema.validate({ roles: ['admin', 'user'] }, function(err, res) {
      expect(res.errors.length).to.eql(2);
      expect(res.errors[0].message).to.eql('roles must be exactly 3 in length');
      expect(res.errors[1].message).to.eql('2 is required');
      done();
    });
  });

  it('should error on invalid multiple deep rule', function(done) {
    var schema = new Schema(deepObject);
    schema.validate({ address: {house: {}} }, function(err, res) {
      expect(res.errors.length).to.eql(2);
      expect(res.errors[0].message).to.eql('name is required');
      expect(res.errors[1].message).to.eql('number is required');
      done();
    });
  });

  it('should validate deep rule (not required/no matching property)',
    function(done) {
      var schema = new Schema(descriptor);
      schema.validate({}, function(err, res) {
        expect(err).to.eql(null);
        expect(res).to.eql(null);
        done();
      });
    }
  );

  it('should validate deep rule (array type)', function(done) {
    var schema = new Schema(arrayFields)
      , source = {roles: ['admin', 'user', 'guest']};
    schema.validate(source, function(err, res) {
      expect(err).to.eql(null);
      expect(res).to.eql(null);
      done();
    });
  });

});
