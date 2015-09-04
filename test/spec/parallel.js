var util = require('util');
var assert = require('chai').assert;
var schema = require('../../index');

describe("async-validate:", function() {
  it("should use default series iteration", function(done) {
    var descriptor = {
      name: {type: "string", len: 8},
    }
    var validator = new schema(descriptor);
    validator.validate({name: "username", surname: 'foo'},
      function(errors, fields) {
        assert.isNull(errors);
        assert.isNull(fields);
        done();
      }
    );
  });

  it("should use parallel iteration", function(done) {
    var descriptor = {
      name: {type: "string", len: 8},
    }
    var validator = new schema(descriptor);
    validator.validate({name: "username", surname: 'foo'}, {parallel: true},
      function(errors, fields) {
        assert.isNull(errors);
        assert.isNull(fields);
        done();
      }
    );
  });
});
