var expect = require('chai').expect
  , schema = require('../../index');

describe("async-validate:", function() {

  it("should error on invalid source object (additional properties)", function(done) {
    var opts = {
      rules: {type: 'object', additional: false}
    }
    var descriptor = {
      address: {
        type: "object",
        required: true
      }
    }
    var source = {
      name: 'Oops',
      address: {}
    }
    var validator = new schema(descriptor);
    validator.validate(source, opts, function(errors, fields) {
      // NOTE: `source` is the default field name for root object
      var expected = 'extraneous fields (name) found in source';
      expect(errors.length).to.eql(1);
      expect(errors[0].message).to.eql(expected);
      done();
    });
  });

  it("should validate with no additional properties", function(done) {
    var opts = {
      // NOTE: use array of rules to trigger code path
      rules: [{type: 'object', additional: false}]
    }
    var descriptor = {
      address: {
        type: "object",
        required: true
      }
    }
    var source = {
      address: {}
    }
    var validator = new schema(descriptor);
    validator.validate(source, opts, function(errors, fields) {
      expect(errors).to.eql(null);
      done();
    });
  });

});
