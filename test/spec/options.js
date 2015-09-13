var expect = require('chai').expect
  , Schema = require('../../index');

describe("async-validate:", function() {

  var descriptor = {
    firstname: {type: "string", required: true},
    surname: {type: "string", required: true}
  }

  it("should error with multiple errors", function(done) {
    var schema = new Schema(descriptor);
    schema.validate({}, {first: false}, function(errors, fields) {
      expect(errors.length).to.eql(2);
      done();
    });
  });

  it("should error with keys option", function(done) {
    var schema = new Schema(descriptor);
    schema.validate({}, {keys: ["firstname"]}, function(errors, fields) {
      expect(errors.length).to.eql(1);
      done();
    });
  });

  it("should error on first error", function(done) {
    var schema = new Schema(descriptor);
    schema.validate({}, {first: true}, function(errors, fields) {
      expect(errors.length).to.eql(1);
      done();
    });
  });

  it("should error with single option", function(done) {
    var descriptor = {
      name: {type: "string", required: true, min: 10, pattern: /^[^-].*$/}
    }
    var schema = new Schema(descriptor)
      , source = {name: "-name"}
      , opts = {first: true, single: true};

    schema.validate(source, opts, function(errors, fields) {
      expect(errors.length).to.eql(1);
      expect(fields.name.length).to.eql(1);
      done();
    });
  });

});
