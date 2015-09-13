var expect = require('chai').expect
  , Schema = require('../../index');

describe('async-validate:', function() {

  var descriptor = {
    role: {type: 'enum', list: ['admin', 'user', 'guest']}
  }

  it('should error on invalid enum value', function(done) {
    var schema = new Schema(descriptor);
    schema.validate({role: 'manager'}, function(err, res) {
      expect(res.errors.length).to.eql(1);
      expect(res.errors[0].message).to.eql(
        'role must be one of admin, user, guest');
      done();
    });
  });

  it('should validate enum value', function(done) {
    var schema = new Schema(descriptor);
    schema.validate({role: 'user'}, function(err, res) {
      expect(err).to.eql(null);
      expect(res).to.eql(null);
      done();
    });
  });

});
