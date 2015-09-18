var expect = require('chai').expect
  , Schema = require('../../index')
  , descriptor = require('../fixtures/schema/function')
  , length = require('../fixtures/schema/function-length')
  , min = require('../fixtures/schema/function-min')
  , max = require('../fixtures/schema/function-max')
  , range = require('../fixtures/schema/function-range');

describe('async-validate:', function() {

  it('should error on value that is not a function', function(done) {
    var schema = new Schema(descriptor);
    schema.validate({mock: 80}, function(err, res) {
      expect(res.errors.length).to.eql(1);
      expect(res.errors[0].message).to.eql('mock is not a function');
      done();
    });
  });

  it('should error on invalid arity (len: 1)', function(done) {
    var schema = new Schema(length);
    schema.validate({mock: function(){}}, function(err, res) {
      expect(res.errors.length).to.eql(1);
      expect(res.errors[0].message).to.eql(
        'mock must have exactly 1 arguments');
      done();
    });
  });

  it('should error on invalid arity (min: 1)', function(done) {
    var schema = new Schema(min);
    schema.validate({mock: function(){}}, function(err, res) {
      expect(res.errors.length).to.eql(1);
      expect(res.errors[0].message).to.eql(
        'mock must have at least 1 arguments');
      done();
    });
  });

  it('should error on invalid arity (max: 0)', function(done) {
    var schema = new Schema(max);
    schema.validate({mock: function(foo){foo();}}, function(err, res) {
      expect(res.errors.length).to.eql(1);
      expect(res.errors[0].message).to.eql(
        'mock cannot have more than 0 arguments');
      done();
    });
  });

  it('should error on invalid arity (min: 0, max: 1)', function(done) {
    var schema = new Schema(range)
      , source = {mock: function(foo, bar){foo();bar()}};

    schema.validate(source, function(err, res) {
      expect(res.errors.length).to.eql(1);
      expect(res.errors[0].message).to.eql(
        'mock must have arguments length between 0 and 1');
      done();
    });
  });

  it('should validate function type', function(done) {
    var schema = new Schema(descriptor);
    schema.validate({mock: function(){}}, function(err, res) {
      expect(err).to.eql(null);
      expect(res).to.eql(null);
      done();
    });
  });

});
