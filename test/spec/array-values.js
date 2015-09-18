var expect = require('chai').expect
  , Schema = require('../../index')
  , descriptor = require('../fixtures/schema/typed-array')
  , mixed = require('../fixtures/schema/typed-array-mixed')
  , empty = require('../fixtures/schema/typed-array-empty');

describe('async-validate:', function() {

  it('should error on invalid array value type', function(done) {
    var schema = new Schema(descriptor);
    schema.validate({list: [1,2,3,'foo']}, function(err, res) {
      expect(res.errors.length).to.eql(1);
      expect(res.errors[0].message).to.eql('foo is not an integer');
      done();
    });
  });

  it('should error on invalid array value types', function(done) {
    var schema = new Schema(mixed);
    schema.validate({list: [16,'foo', 12]}, function(err, res) {
      expect(res.errors.length).to.eql(1);
      expect(res.errors[0].message).to.eql('12 is not a float');
      done();
    });
  });

  it('should validate array values', function(done) {
    var schema = new Schema(descriptor);
    schema.validate({list: [1,2,3]}, function(err, res) {
      expect(err).to.eql(null);
      expect(res).to.eql(null);
      done();
    });
  });

  it('should validate array values with empty array', function(done) {
    var schema = new Schema(descriptor);
    schema.validate({list: []}, function(err, res) {
      expect(err).to.eql(null);
      expect(res).to.eql(null);
      done();
    });
  });

  it('should validate array values with no field', function(done) {
    var schema = new Schema(descriptor);
    schema.validate({}, function(err, res) {
      expect(err).to.eql(null);
      expect(res).to.eql(null);
      done();
    });
  });

  it('should ignore validation with empty array as values', function(done) {
    var schema = new Schema(empty);
    schema.validate({list: [1,2,3, 'foo']}, function(err, res) {
      expect(err).to.eql(null);
      expect(res).to.eql(null);
      done();
    });
  });

});
