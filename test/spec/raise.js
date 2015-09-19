var expect = require('chai').expect
  , Schema = require('../../index')
  , descriptor = require('../fixtures/schema/raise');

describe('async-validate:', function() {

  it('should use raise() helper method', function(done) {
    var schema = new Schema(descriptor)
      , source = {};
    schema.validate(source, function(err, res) {
      expect(res.errors.length).to.eql(1);
      expect(res.errors[0].message).to.eql('name is a required field');

      expect(res.errors[0].field).to.be.a('string');
      expect(res.errors[0].value).to.eql(undefined);
      expect(res.errors[0].parent).to.be.an('object');
      expect(res.errors[0].parent).to.equal(source);
      expect(res.errors[0].reason).to.be.an('object');
      done();
    });
  });

});
