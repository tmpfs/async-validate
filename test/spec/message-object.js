var expect = require('chai').expect
  , Schema = require('../../index')
  , descriptor = require('../fixtures/schema/message-object');

describe('async-validate:', function() {

  it('should validate using a custom error message as min', function(done) {
    var schema = new Schema(descriptor);
    schema.validate({num: -1}, function(err, res) {
      expect(res.errors[0].message).to.eql('Number may not be below zero');
      done();
    });
  });

  it('should validate using a custom error message as max', function(done) {
    var schema = new Schema(descriptor);
    schema.validate({num: 11}, function(err, res) {
      expect(res.errors[0].message).to.eql('Number may not be above ten');
      done();
    });
  });

});
