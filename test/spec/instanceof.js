var expect = require('chai').expect
  , Schema = require('../../index')
  , Component = require('../fixtures/component')
  , descriptor = require('../fixtures/schema/instanceof')
  , anonymous = require('../fixtures/schema/instanceof-anonymous')
  , message = require('../fixtures/schema/instanceof-message');

describe("async-validate:", function() {

  it("should error on type as class (instanceof)", function(done) {
    var schema = new Schema(descriptor);
    schema.validate({instance: []}, function(err, res) {
      expect(res.errors.length).to.eql(1);
      expect(res.errors[0].message).to.eql(
        'instance is not an instance of Component');
      done();
    });
  });

  it("should error on type as class (instanceof) anonymous", function(done) {
    var schema = new Schema(anonymous);
    schema.validate({instance: []}, function(err, res) {
      expect(res.errors.length).to.eql(1);
      expect(
        /instance is not an instance of/.test(res.errors[0].message))
          .to.eql(true)
      done();
    });
  });

  it("should error on type as class (instanceof) w/ message", function(done) {
    var schema = new Schema(message);
    schema.validate({instance: []}, function(err, res) {
      expect(res.errors.length).to.eql(1);
      expect(res.errors[0].message).to.eql('instance is not a Component');
      done();
    });
  });

  it("should validate on type as class (instanceof)", function(done) {
    var schema = new Schema(message);
    schema.validate({instance: new Component()}, function(err, res) {
      expect(err).to.eql(null);
      expect(res).to.eql(null);
      done();
    });
  });

});
