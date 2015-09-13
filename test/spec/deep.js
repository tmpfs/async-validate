var expect = require('chai').expect
  , Schema = require('../../index');

describe("async-validate:", function() {

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

  var required = {
    address: {
      type: "object", required: true,
      fields: {
        street: {type: "string", required: true},
        city: {type: "string", required: true},
        zip: {type: "string", required: true, len: 8, message: "Invalid zip"}
      }
    }
  }

  var details = {
    name: {type: "string", required: true},
    address: {
      type: "object", required: true,
      fields: {
        street: {type: "string", required: true},
        city: {type: "string", required: true},
        zip: {type: "string", required: true, len: 8, message: "invalid zip"}
      }
    }
  }

  it("should error on invalid deep rule (required/no matching property)",
    function(done) {
      var schema = new Schema(required);
      schema.validate({}, function(errors, fields) {
        expect(errors.length).to.eql(1);
        expect(errors[0].message).to.eql('address is required');
        done();
      });
    }
  );

  it("should error on invalid deep rule (required and validation failure on deep rule)",
    function(done) {
      var schema = new Schema(details);
      schema.validate({ address: {} }, function(errors, fields) {
        expect(errors.length).to.eql(4);
        expect(errors[0].message).to.eql('name is required');
        expect(errors[1].message).to.eql('street is required');
        expect(errors[2].message).to.eql('city is required');
        expect(errors[3].message).to.eql('invalid zip');
        done();
      });
    }
  );
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
    var schema = new Schema(descriptor);
    schema.validate({ address: {} }, function(errors, fields) {
      expect(errors.length).to.eql(2);
      expect(errors[0].message).to.eql('street is required');
      expect(errors[1].message).to.eql('name is required');
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
    var schema = new Schema(descriptor);
    schema.validate({ roles: ["admin", "user"] }, function(errors, fields) {
      expect(errors.length).to.eql(2);
      expect(errors[0].message).to.eql('roles must be exactly 3 in length');
      expect(errors[1].message).to.eql('2 is required');
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

    var schema = new Schema(descriptor);
    schema.validate({ address: {house: {}} }, function(errors, fields) {
      expect(errors.length).to.eql(2);
      expect(errors[0].message).to.eql('name is required');
      expect(errors[1].message).to.eql('number is required');
      done();
    });
  });

  it("should validate deep rule (not required/no matching property)",
    function(done) {
      var schema = new Schema(descriptor);
      schema.validate({}, function(errors, fields) {
        expect(errors).to.eql(null);
        done();
      });
    }
  );

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
    var schema = new Schema(descriptor)
      , source = {roles: ["admin", "user", "guest"]};
    schema.validate(source, function(errors, fields) {
      expect(errors).to.eql(null);
      done();
    });
  });


});
