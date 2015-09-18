var expect = require('chai').expect
  , Schema = require('../../index')
  , descriptor = require('../fixtures/schema/placeholder');

describe("async-validate:", function() {

  it("should set default value for field (placeholder)", function(done) {
    var schema= new Schema(descriptor)
      , source = {};
    schema.validate(source, function() {
      expect(source.list).to.eql([]);
      done();
    });
  });

});
