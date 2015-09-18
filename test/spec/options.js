var expect = require('chai').expect
  , Schema = require('../../index')
  , descriptor = require('../fixtures/schema/options')
  , pattern = require('../fixtures/schema/options-pattern');

describe('async-validate:', function() {

  it('should error with multiple errors', function(done) {
    var schema = new Schema(descriptor);
    schema.validate({}, {first: false}, function(err, res) {
      expect(res.errors.length).to.eql(2);
      done();
    });
  });

  it('should error with keys option', function(done) {
    var schema = new Schema(descriptor);
    schema.validate({}, {keys: ['firstname']}, function(err, res) {
      expect(res.errors.length).to.eql(1);
      done();
    });
  });

  it('should error on first error', function(done) {
    var schema = new Schema(descriptor);
    schema.validate({}, {first: true}, function(err, res) {
      expect(res.errors.length).to.eql(2);
      done();
    });
  });

  it('should error with single option', function(done) {
    var schema = new Schema(pattern)
      , source = {name: '-name'}
      , opts = {first: true, single: true};

    schema.validate(source, opts, function(err, res) {
      expect(res.errors.length).to.eql(1);
      expect(res.fields.name.length).to.eql(1);
      done();
    });
  });

  it('should error on first error (bail)', function(done) {
    var schema = new Schema(descriptor);
    schema.validate({}, {bail: true}, function(err, res) {
      expect(res.errors.length).to.eql(1);
      done();
    });
  });

});
