var expect = require('chai').expect
  , schema = require('../../index');

describe('async-validate:', function() {

  var descriptor = {
    id: {type: 'id'},
  }

  before(function(done) {
    // load plugin definition
    schema.plugin([require('../fixtures/plugin')]);
    done();
  });

  it('should error using custom plugin', function(done) {
    var validator = new schema(descriptor);
    validator.validate({id: '-hyphen'}, function(err, res) {
      expect(res.errors.length).to.eql(1);
      expect(res.errors[0].message).to.eql('id is not a valid identifier');
      done();
    });
  });

  it('should validate custom plugin', function(done) {
    var validator = new schema(descriptor);
    validator.validate({id: 'my-valid-id'}, function(err, res) {
      expect(err).to.eql(null);
      expect(res).to.eql(null);
      done();
    });
  });
});
