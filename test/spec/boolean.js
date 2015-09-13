var expect = require('chai').expect
  , Schema = require('../../index');

describe('async-validate:', function() {

  var descriptor = {
    flag: {type: 'boolean'},
  }

  it('should error on non-boolean type', function(done) {
    var schema = new Schema(descriptor);
    schema.validate({flag: 'false'}, function(err, res) {
      expect(res.errors.length).to.eql(1);
      expect(res.errors[0].message).to.eql('flag is not a boolean');
      done();
    });
  });

  it('should validate boolean pass', function(done) {
    var schema = new Schema(descriptor);
    schema.validate({flag: true}, function(err, res) {
      expect(err).to.eql(null);
      expect(res).to.eql(null);
      done();
    });
  });

});
