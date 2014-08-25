var util = require('util');
var assert = require('chai').assert;
var schema = require('../index');
var sanitize = require('validator').sanitize;

suite("async-validate:", function() {
  test("should allow undefined integer field if not required", function() {
    var descriptor = {
      name: {type: 'string'},
      age: {type: 'integer', required: false}
    }
    var validator = new schema(descriptor);
    var source = {age: undefined, name : "User"};
    var opts = {first : false, single: true};
    validator.validate(source, opts, function(errors, fields) {
      assert.isNull(errors);
      assert.isNull(fields);
    });
  });
  test("should allow undefined integer field if not required (first)",
    function() {
      var descriptor = {
        name: {type: 'string'},
        age: {type: 'integer', required: false}
      }
      var validator = new schema(descriptor);
      var source = {age: undefined, name : "User"};
      var opts = {first : true, single: true};
      validator.validate(source, opts, function(errors, fields) {
        assert.isNull(errors);
        assert.isNull(fields);
      });
    }
  );
  test("should error on invalid integer field if not required (first/single)",
    function() {
      var descriptor = {
        name: {type: 'string'},
        age: {type: 'integer', required: false}
      }
      var validator = new schema(descriptor);
      var source = {age: 'abc', name : "User"};
      var opts = {first : true, single: true};
      validator.validate(source, opts, function(errors, fields) {
        assert.equal(errors.length, 1);
        assert.equal(errors[0].message, "age is not an integer");
        assert.equal(errors[0].field, 'age');
      });
    }
  );
});
