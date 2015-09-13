var expect = require('chai').expect
  , schema = require('../../index');

describe("async-validate:", function() {

  var descriptor = {
    address: {
      type: "object",
      required: true,
      additional: false,
      fields: {
        street: {type: "string", required: true},
        city: {type: "string", required: true},
        zip: {type: "string", required: true, len: 8, message: "Invalid zip"}
      }
    }
  }

  it("should error on invalid object (additional properties)", function(done) {
    var opts = {
      rules: {type: 'object', additional: false},
      // set root source object field name
      field: 'root'
    }
    var source = {
      name: 'Opps',
      address: {
        name: 'Oops',
        street: 'Mock St',
        city: 'Mock City',
        zip: '12345678',
      }
    }
    var validator = new schema(descriptor);
    validator.validate(source, opts, function(errors, fields) {
      expect(errors.length).to.eql(2);
      expect(errors[0].message).to.eql(
        'extraneous fields (name) found in root');
      expect(errors[1].message).to.eql(
        'extraneous fields (name) found in address');
      done();
    });
  });

  it("should validate with no additional properties", function(done) {
    var opts = {
      rules: {type: 'object', additional: false}
    }
    var source = {
      address: {
        street: 'Mock St',
        city: 'Mock City',
        zip: '12345678',
      }
    }
    var validator = new schema(descriptor);
    validator.validate(source, opts, function(errors, fields) {
      expect(errors).to.eql(null);
      done();
    });
  });

});
