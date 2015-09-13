var expect = require('chai').expect
  , schema = require('../../index');

describe('async-validate:', function() {

  it('should validate using a custom error message as min', function(done) {
    var descriptor = {
      num: {
        type: 'number', min: 0, max: 10,
        message: {
          min: 'Number may not be below zero',
          max: 'Number may not be above ten',
        }
      }
    }
    var validator = new schema(descriptor);
    validator.validate({num: -1}, function(err, res) {
      expect(res.errors[0].message).to.eql('Number may not be below zero');
      done();
    });
  });

  it('should validate using a custom error message as max', function(done) {
    var descriptor = {
      num: {
        type: 'number', min: 0, max: 10,
        message: {
          min: 'Number may not be below zero',
          max: 'Number may not be above ten',
        }
      }
    }
    var validator = new schema(descriptor);
    validator.validate({num: 11}, function(err, res) {
      expect(res.errors[0].message).to.eql('Number may not be above ten');
      done();
    });
  });

});
