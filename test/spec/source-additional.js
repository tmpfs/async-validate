var expect = require('chai').expect
  , schema = require('../../index');

describe("async-validate:", function() {

  var descriptor = {
    type: 'object',
    additional: false,
    // trigger code path whereby transform cannot assign inline
    // on root object as there is no parent object to assign to
    transform: function(value) {
      return value; 
    },
    fields: {
      address: {
        type: "object",
        required: true
      }
    }
  }

  it("should error on invalid source object (additional properties)",
    function(done) {
      var source = {
        name: 'Oops',
        address: {}
      }
      var validator = new schema(descriptor);
      validator.validate(source, function(err, res) {
        // NOTE: `source` is the default field name for root object
        var expected = 'extraneous fields (name) found in source';
        expect(res.errors.length).to.eql(1);
        expect(res.errors[0].message).to.eql(expected);
        done();
      });
    }
  );

  it("should validate with no additional properties", function(done) {
    var source = {
      address: {}
    }
    var validator = new schema(descriptor);
    validator.validate(source, function(err, res) {
      expect(err).to.eql(null);
      expect(res).to.eql(null);
      done();
    });
  });

});
