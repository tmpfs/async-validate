var util = require('util');
var assert = require('chai').assert;
var schema = require('../../index');
var ValidationError = schema.error;

describe("async-validate:", function() {
  it("should validate a required string field is valid", function(done) {
    var descriptor = {
      name: {type: "string", required: true}
    }
    var validator = new schema(descriptor);
    validator.validate({name: "field"}, function(errors, fields) {
      assert.isNull(errors);
      assert.isNull(fields);
      done();
    });
  });

  it("should validate using a custom validator function", function(done) {
    var descriptor = {
      name: function(descriptor, value, callback, values) {
        var errors = [];
        if(!/^[a-z0-9]+$/.test(value)) {
          errors.push(
            new ValidationError(
              util.format("%s must be lowercase alphanumeric characters",
                descriptor.field)));
        }
        callback(errors);
      }
    }
    var validator = new schema(descriptor);
    validator.validate({name: "Firstname"}, function(errors, fields) {
      assert.equal(errors.length, 1);
      assert.equal(errors[0].message,
        "name must be lowercase alphanumeric characters");
      done();
    });
  });
  it("should validate a required string field", function(done) {
    var descriptor = {
      name: {type: "string", required: true}
    }
    var validator = new schema(descriptor);
    validator.validate({noname: "field"}, function(errors, fields) {
      assert.equal(errors.length, 1);
      assert.equal(errors[0].message, "name is required");
      assert.equal(fields.name.length, 1);
      assert.isTrue((fields.name[0] instanceof ValidationError));
      done();
    });
  });
  it("should validate a required string field (null)", function(done) {
    var descriptor = {
      name: {type: "string", required: true}
    }
    var validator = new schema(descriptor);
    validator.validate({name: null}, function(errors, fields) {
      assert.equal(errors.length, 1);
      assert.equal(errors[0].message, "name is required");
      assert.equal(fields.name.length, 1);
      assert.isTrue((fields.name[0] instanceof ValidationError));
      done();
    });
  });
  it("should validate a field of type string is of the correct type", function(done) {
    var descriptor = {
      name: {type: "string"}
    }
    var validator = new schema(descriptor);
    validator.validate({name: 10}, function(errors, fields) {
      assert.equal(errors.length, 1);
      assert.equal(errors[0].message, "name is not a string");
      done();
    });
  });
  it("should validate a required string field with minimum length", function(done) {
    var descriptor = {
      name: {type: "string", required: true, min: 8}
    }
    var validator = new schema(descriptor);
    validator.validate({name: "field"}, function(errors, fields) {
      assert.equal(errors.length, 1);
      assert.equal(errors[0].message, "name must be at least 8 characters");
      done();
    });
  });
  it("should validate a required string field with maximum length", function(done) {
    var descriptor = {
      name: {type: "string", required: true, max: 2}
    }
    var validator = new schema(descriptor);
    validator.validate({name: "field"}, function(errors, fields) {
      assert.equal(errors.length, 1);
      assert.equal(errors[0].message, "name cannot be longer than 2 characters");
      done();
    });
  });
  it("should validate a required string field is less than a length range",
    function(done) {
      var descriptor = {
        name: {type: "string", required: true, min: 6, max: 8}
      }
      var validator = new schema(descriptor);
      validator.validate({name: "field"}, function(errors, fields) {
        assert.equal(errors.length, 1);
        assert.equal(
          errors[0].message,
          "name must be between 6 and 8 characters");
        done();
      });
    }
  );
  it("should validate a required string field is greater than a length range",
    function(done) {
      var descriptor = {
        name: {type: "string", required: true, min: 2, max: 4}
      }
      var validator = new schema(descriptor);
      validator.validate({name: "field"}, function(errors, fields) {
        assert.equal(errors.length, 1);
        assert.equal(
          errors[0].message,
          "name must be between 2 and 4 characters");
        done();
      });
    }
  );
  it("should validate a regular expression pattern mismatch",
    function(done) {
      var descriptor = {
        name: {pattern: /^[0-9]+$/}
      }
      var validator = new schema(descriptor);
      validator.validate({name: "alpha"}, function(errors, fields) {
        assert.equal(errors.length, 1);
        //console.log(errors[0].message);
        assert.equal(
          errors[0].message,
          "name value alpha does not match pattern /^[0-9]+$/");
        done();
      });
    }
  );
  it("should validate a string consisting of whitespace",
    function(done) {
      var descriptor = {
        name: {type: "string", whitespace: true}
      }
      var validator = new schema(descriptor);
      validator.validate({name: "   "}, function(errors, fields) {
        assert.equal(errors.length, 1);
        //console.log(errors[0].message);
        assert.equal( errors[0].message, "name cannot be empty");
        done();
      });
    }
  );
  it("should validate the empty string",
    function(done) {
      var descriptor = {
        name: {type: "string", required: true, whitespace: true}
      }
      var validator = new schema(descriptor);
      validator.validate({name: ""}, function(errors, fields) {
        assert.equal(errors.length, 1);
        //console.log(errors[0].message);
        assert.equal( errors[0].message, "name cannot be empty");
        done();
      });
    }
  );
  it("should revalidate after failure",
    function(done) {
      var descriptor = {
        name: {type: "string", required: true, whitespace: true}
      }
      var validator = new schema(descriptor);
      validator.validate({name: ""}, function(errors, fields) {
        assert.equal(errors.length, 1);
        assert.equal( errors[0].message, "name cannot be empty");
        validator.validate({name: "user"}, function(errors, fields) {
          //console.log("after revalidation %j", errors);
          assert.isNull(errors);
          assert.isNull(fields);
          done();
        });
      });
    }
  );
});
