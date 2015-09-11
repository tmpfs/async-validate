var util = require('util');
var assert = require('chai').assert;
var schema = require('../../index');

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
      assert.equal(errors.length, 1);
      assert.equal(errors[0].message, "id is not a valid identifier");
      done();
    });
  });

  it("should validate custom plugin", function(done) {
    var descriptor = {
      id: {type: "id"},
    }
    var validator = new schema(descriptor);
    validator.validate({id: "my-valid-id"}, function(errors, fields) {
      assert.isNull(errors);
      assert.isNull(fields);
      done();
    });
  });
});
