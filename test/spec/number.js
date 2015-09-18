var expect = require('chai').expect
  , Schema = require('../../index');

describe('async-validate:', function() {

  it('should error on not a number', function(done) {
    var descriptor = {
      port: {type: 'number'}
    }
    var schema = new Schema(descriptor);
    schema.validate({port: '80'}, function(err, res) {
      expect(res.errors.length).to.eql(1);
      expect(res.errors[0].message).to.eql(
        'port is not a number');
      done();
    });
  });

  it('should error on number greater than a minimum value', function(done) {
    var descriptor = {
      port: {type: 'number', min: 8080}
    }
    var schema = new Schema(descriptor);
    schema.validate({port: 80}, function(err, res) {
      expect(res.errors.length).to.eql(1);
      expect(res.errors[0].message).to.eql(
        'port cannot be less than 8080');
      done();
    });
  });

  it('should error on number number greater than a minimum value',
    function(done) {
      var descriptor = {
        port: {type: 'number', max: 80}
      }
      var schema = new Schema(descriptor);
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
      var descriptor = {
        port: {type: 'number', min: 80, max: 1024}
      }
      var schema = new Schema(descriptor);
      schema.validate({port: 8080}, function(err, res) {
        expect(res.errors.length).to.eql(1);
        expect(res.errors[0].message).to.eql(
          'port must be between 80 and 1024');
        done();
      });
    }
  );

});
