var expect = require('chai').expect
  , Schema = require('../../index');

describe("async-validate:", function() {

  it("should error on invalid string length", function(done) {
    var descriptor = {
      name: {type: "string", len: 10},
    }
    var schema = new Schema(descriptor);
    schema.validate({name: "user"}, function(errors, fields) {
      expect(errors.length).to.eql(1);
      expect(errors[0].message).to.eql('name must be exactly 10 characters');
      done();
    });
  });

  it("should error on invalid number length", function(done) {
    var descriptor = {
      port: {type: "number", len: 80},
    }
    var schema = new Schema(descriptor);
    schema.validate({port: 8080}, function(errors, fields) {
      expect(errors.length).to.eql(1);
      expect(errors[0].message).to.eql('port must equal 80');
      done();
    });
  });

  it("should error on invalid array length", function(done) {
    var descriptor = {
      roles: {type: "array", len: 2},
    }
    var schema = new Schema(descriptor);
    schema.validate({roles: ["user"]}, function(errors, fields) {
      expect(errors.length).to.eql(1);
      expect(errors[0].message).to.eql('roles must be exactly 2 in length');
      done();
    });
  });

  it("should validate string length", function(done) {
    var descriptor = {
      name: {type: "string", len: 8},
    }
    var schema = new Schema(descriptor);
    schema.validate({name: "username"}, function(errors, fields) {
      expect(errors).to.eql(null);
      done();
    });
  });

  it("should validate number length", function(done) {
    var descriptor = {
      port: {type: "number", len: 80},
    }
    var schema = new Schema(descriptor);
    schema.validate({port: 80}, function(errors, fields) {
      expect(errors).to.eql(null);
      done();
    });
  });

  it("should validate array length", function(done) {
    var descriptor = {
      roles: {type: "array", len: 2},
    }
    var schema = new Schema(descriptor);
    schema.validate({roles: ["user", "admin"]}, function(errors, fields) {
      expect(errors).to.eql(null);
      done();
    });
  });

});
