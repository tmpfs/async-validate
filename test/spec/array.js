var expect = require('chai').expect
  , Schema = require('../../index');

describe('async-validate:', function() {

  it('should error on non-array type', function(done) {
    var descriptor = {
      list: {type: 'array'},
    }
    var schema = new Schema(descriptor);
    schema.validate({list: false}, function(err, res) {
      expect(res.errors.length).to.eql(1);
      expect(res.errors[0].message).to.eql(
        'list is not an array');
      done();
    });
  });

  it('should error on array length minimum', function(done) {
    var descriptor = {
      list: {type: 'array', min: 2},
    }
    var schema = new Schema(descriptor);
    schema.validate({list: [1]}, function(err, res) {
      expect(res.errors.length).to.eql(1);
      expect(res.errors[0].message).to.eql(
        'list cannot be less than 2 in length');
      done();
    });
  });

  it('should error on array length maximum', function(done) {
    var descriptor = {
      list: {type: 'array', max: 2},
    }

    var schema = new Schema(descriptor);
    schema.validate({list: [1,2,3]}, function(err, res) {
      expect(res.errors.length).to.eql(1);
      expect(res.errors[0].message).to.eql(
        'list cannot be greater than 2 in length');
      done();
    });
  });

  it('should error on array length range', function(done) {
    var descriptor = {
      list: {type: 'array', min: 1, max: 2},
    }

    var schema = new Schema(descriptor);
    schema.validate({list: [1,2,3]}, function(err, res) {
      expect(res.errors.length).to.eql(1);
      expect(res.errors[0].message).to.eql(
        'list must be between 1 and 2 in length');
      done();
    });
  });

});
