var expect = require('chai').expect
  , schema = require('../../index');

describe("async-validate:", function() {

  before(function(done) {
    // load plugin definition
    schema.plugin([require('../fixtures/plugin')]);
    done();
  });

  it("should error using custom plugin", function(done) {
    var descriptor = {
      id: {type: "id"},
    }
    var validator = new schema(descriptor);
    validator.validate({id: "-hyphen"}, function(errors, fields) {
      expect(errors.length).to.eql(1);
      expect(errors[0].message).to.eql("id is not a valid identifier");
      done();
    });
  });

  it("should validate custom plugin", function(done) {
    var descriptor = {
      id: {type: "id"},
    }
    var validator = new schema(descriptor);
    validator.validate({id: "my-valid-id"}, function(errors, fields) {
      expect(errors).to.eql(null);
      done();
    });
  });
});
