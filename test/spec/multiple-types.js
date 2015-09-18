var expect = require('chai').expect
  , Schema = require('../../index')
  , descriptor = require('../fixtures/schema/multiple-types')
  , required = require('../fixtures/schema/multiple-types-required');

describe('async-validate:', function() {

  it('should error on invalid type with multiple types array', function(done) {
    var schema = new Schema(descriptor);
    schema.validate({prop: []}, function(err, res) {
      expect(res.errors.length).to.eql(1);
      expect(res.errors[0].message).to.eql(
        'prop is not one of the allowed types Boolean, '
          + 'string, Component, function (anonymous)');
      done();
    });
  });

  it('should validate with multiple types array', function(done) {
    var schema = new Schema(descriptor);
    schema.validate({prop: 'foo'}, function(err, res) {
      expect(err).to.eql(null);
      expect(res).to.eql(null);
      done();
    });
  });

  it('should error on required with multiple types array',
    function(done) {
      var schema = new Schema(required);
      schema.validate({}, function(err, res) {
        expect(res.errors.length).to.eql(1);
        expect(res.errors[0].message).to.eql('prop is required');
        done();
      });
    }
  );

  it('should bypass validation with optional field',
    function(done) {
      var schema = new Schema(descriptor);
      schema.validate({prop: undefined}, function(err, res) {
        expect(err).to.eql(null);
        expect(res).to.eql(null);
        done();
      });
    }
  );

});
