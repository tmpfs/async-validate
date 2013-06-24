var util = require('util');
var assert = require('chai').assert;
var schema = require('../index');

suite("Deep validator:", function() {
  test("valid deep rule (not required and no matching property on source)", function() {
    var descriptor = {
      address: {
        type: "object",
        fields: {
          street: {type: "string", required: true},
          city: {type: "string", required: true},
          zip: {type: "string", required: true, len: 8, message: "Invalid zip"}
        }
      }
    }
    var validator = new schema(descriptor);
    validator.validate({}, function(errors, fields) {
      assert.isNull(errors);
      assert.isNull(fields);
    });
  });
  test("invalid deep rule (required and no matching property on source)", function() {
    var descriptor = {
      address: {
        type: "object", required: true,
        fields: {
          street: {type: "string", required: true},
          city: {type: "string", required: true},
          zip: {type: "string", required: true, len: 8, message: "Invalid zip"}
        }
      }
    }
    var validator = new schema(descriptor);
    validator.validate({}, function(errors, fields) {
      assert.equal(errors.length, 1);
      assert.equal(errors[0].message, "address is required");
    });
  });
  test("invalid deep rule (required and validation failure on deep rule)", function() {
    var descriptor = {
      address: {
        type: "object", required: true,
        fields: {
          street: {type: "string", required: true},
          city: {type: "string", required: true},
          zip: {type: "string", required: true, len: 8, message: "invalid zip"}
        }
      },
      name: {type: "string", required: true}
    }
    var validator = new schema(descriptor);
    validator.validate({ address: {} }, function(errors, fields) {
      assert.equal(errors.length, 4);
      assert.equal(errors[0].message, "street is required");
      assert.equal(errors[1].message, "city is required");
      assert.equal(errors[2].message, "invalid zip");
      assert.equal(errors[3].message, "name is required");
    });
  });
  test("invalid deep rule (with bail out options)", function() {
    var descriptor = {
      address: {
        type: "object", required: true, options: {single: true, first: true},
        fields: {
          street: {type: "string", required: true},
          city: {type: "string", required: true},
          zip: {type: "string", required: true, len: 8, message: "invalid zip"}
        }
      },
      name: {type: "string", required: true}
    }
    var validator = new schema(descriptor);
    validator.validate({ address: {} }, function(errors, fields) {
      assert.equal(errors.length, 2);
      assert.equal(errors[0].message, "street is required");
      assert.equal(errors[1].message, "name is required");
    });
  });

  test("invalid deep rule (array type length mismatch)", function() {
    var descriptor = {
      roles: {
        type: "array", required: true, len: 3,
        fields: {
          0: {type: "string", required: true},
          1: {type: "string", required: true},
          2: {type: "string", required: true}
        }
      }
    }
    var validator = new schema(descriptor);
    validator.validate({ roles: ["admin", "user"] }, function(errors, fields) {
      assert.equal(errors.length, 2);
      assert.equal(errors[0].message, "roles must be exactly 3 in length");
      assert.equal(errors[1].message, "2 is required");
    });
  });

  test("valid deep rule (array type)", function() {
    var descriptor = {
      roles: {
        type: "array", required: true, len: 3,
        fields: {
          0: {type: "string", required: true},
          1: {type: "string", required: true},
          2: {type: "string", required: true}
        }
      }
    }
    var validator = new schema(descriptor);
    validator.validate({ roles: ["admin", "user", "guest"] }, function(errors, fields) {
      assert.isNull(errors);
      assert.isNull(fields);
    });
  });
  test("invalid multiple deep rule", function() {
    var descriptor = {
      address: {
        type: "object", required: true,
        fields: {
          house: {
            type: "object", required: true,
            fields: {
              name: {type: "string", required: true},
              number: {type: "string", required: true}
            }
          }
        }
      }
    }
    var validator = new schema(descriptor);
    validator.validate({ address: {house: {}} }, function(errors, fields) {
      assert.equal(errors.length, 2);
      assert.equal(errors[0].message, "name is required");
      assert.equal(errors[1].message, "number is required");
    });
  });
});
