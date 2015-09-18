var expect = require('chai').expect
  , Schema = require('../../index')
  , descriptor = require('../fixtures/schema/plugin');

describe('async-validate:', function() {

  before(function(done) {
    // load plugin definition
    Schema.plugin([require('../fixtures/plugin')]);
    done();
  });

  it('should error using custom plugin', function(done) {
    var schema = new Schema(descriptor);
    schema.validate({id: '-hyphen'}, function(err, res) {
      expect(res.errors.length).to.eql(1);
      expect(res.errors[0].message).to.eql('id is not a valid identifier');
      done();
    });
  });

  it('should validate custom plugin', function(done) {
    var schema = new Schema(descriptor);
    schema.validate({id: 'my-valid-id'}, function(err, res) {
      expect(err).to.eql(null);
      expect(res).to.eql(null);
      done();
    });
  });
});
