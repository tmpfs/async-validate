var expect = require('chai').expect
  , Schema = require('../../index');

describe('async-validate:', function() {

  var descriptor = {
    mock: {type: 'function'}
  }

  it('should error on value that is not a function', function(done) {
    var schema = new Schema(descriptor);
    schema.validate({mock: 80}, function(err, res) {
      expect(res.errors.length).to.eql(1);
      expect(res.errors[0].message).to.eql('mock is not a function');
      done();
    });
  });

  it('should error on invalid arity (len: 1)', function(done) {
    var descriptor = {
      mock: {type: 'function', len: 1}
    }
    var schema = new Schema(descriptor);
    schema.validate({mock: function(){}}, function(err, res) {
      expect(res.errors.length).to.eql(1);
      expect(res.errors[0].message).to.eql(
        'mock must have exactly 1 arguments');
      done();
    });
  });


  it('should error on invalid arity (min: 1)', function(done) {
    var descriptor = {
      mock: {type: 'function', min: 1}
    }
    var schema = new Schema(descriptor);
    schema.validate({mock: function(){}}, function(err, res) {
      expect(res.errors.length).to.eql(1);
      expect(res.errors[0].message).to.eql(
        'mock must have at least 1 arguments');
      done();
    });
  });

  it('should error on invalid arity (max: 0)', function(done) {
    var descriptor = {
      mock: {type: 'function', max: 0}
    }
    var schema = new Schema(descriptor);
    schema.validate({mock: function(foo){foo();}}, function(err, res) {
      expect(res.errors.length).to.eql(1);
      expect(res.errors[0].message).to.eql(
        'mock cannot have more than 0 arguments');
      done();
    });
  });

  it('should error on invalid arity (min: 0, max: 1)', function(done) {
    var descriptor = {
      mock: {type: 'function', min: 0, max: 1}
    }
    var schema = new Schema(descriptor)
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
