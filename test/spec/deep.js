var assert = require('chai').assert;
var schema = require('../../index');

describe("async-validate:", function() {
  it("should validate deep rule (not required/no matching property)", function(done) {
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
      done();
    });
  });
  it("should error on invalid deep rule (required/no matching property)", function(done) {
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
      done();
    });
  });
  it("should error on invalid deep rule (required and validation failure on deep rule)", function(done) {
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
      done();
    });
  });
  it("should error on deep rule (with bail out options)", function(done) {
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
      done();
    });
  });

  it("should error on deep rule (array type length mismatch)", function(done) {
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
      done();
    });
  });

  it("should validate deep rule (array type)", function(done) {
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
      done();
    });
  });
  it("should error on invalid multiple deep rule", function(done) {
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
      done();
    });
  });
});
