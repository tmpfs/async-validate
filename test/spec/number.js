var expect = require('chai').expect
  , Schema = require('../../index')
  , descriptor = require('../fixtures/schema/number')
  , min = require('../fixtures/schema/number-min')
  , max = require('../fixtures/schema/number-max')
  , range = require('../fixtures/schema/number-range');

describe('async-validate:', function() {

  it('should error on not a number', function(done) {
    var schema = new Schema(descriptor);
    schema.validate({port: '80'}, function(err, res) {
      expect(res.errors.length).to.eql(1);
      expect(res.errors[0].message).to.eql(
        'port is not a number');
      done();
    });
  });

  it('should error on number greater than a minimum value', function(done) {
    var schema = new Schema(min);
    schema.validate({port: 80}, function(err, res) {
      expect(res.errors.length).to.eql(1);
      expect(res.errors[0].message).to.eql(
        'port cannot be less than 8080');
      done();
    });
  });

  it('should error on number greater than a maximum value',
    function(done) {
      var schema = new Schema(max);
      schema.validate({port: 8080}, function(err, res) {
        expect(res.errors.length).to.eql(1);
        expect(res.errors[0].message).to.eql(
          'port cannot be greater than 80');
        done();
      });
    }
  );

  it('should error on number out of range',
    function(done) {
      var schema = new Schema(range);
      schema.validate({port: 8080}, function(err, res) {
        expect(res.errors.length).to.eql(1);
        expect(res.errors[0].message).to.eql(
          'port must be between 80 and 1024');
        done();
      });
    }
  );

});
