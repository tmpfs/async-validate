var expect = require('chai').expect
  , Schema = require('../../index')
  , descriptor = require('../fixtures/schema/source-additional');

describe("async-validate:", function() {

  it("should error on invalid source object (additional properties)",
    function(done) {
      var source = {
        name: 'Oops',
        address: {}
      }
      var schema = new Schema(descriptor);
      schema.validate(source, function(err, res) {
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
    var schema = new Schema(descriptor);
    schema.validate(source, function(err, res) {
      expect(err).to.eql(null);
      expect(res).to.eql(null);
      done();
    });
  });

});
