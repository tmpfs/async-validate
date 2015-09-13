var expect = require('chai').expect
  , Schema = require('../../index');

describe("async-validate:", function() {

  var descriptor = {
    role: {type: "enum", list: ['admin', 'user', 'guest']}
  }

  it("should error on invalid enum value", function(done) {
    var schema = new Schema(descriptor);
    schema.validate({role: "manager"}, function(errors, fields) {
      expect(errors.length).to.eql(1);
      expect(errors[0].message).to.eql('role must be one of admin, user, guest');
      done();
    });
  });

  it("should validate enum value", function(done) {
    var schema = new Schema(descriptor);
    schema.validate({role: "user"}, function(errors, fields) {
      expect(errors).to.eql(null);
      done();
    });
  });

});
