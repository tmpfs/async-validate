var expect = require('chai').expect
  , Schema = require('../../index');

describe("async-validate:", function() {
  var descriptor = {
    list: {
      type: 'array',
      values: {type: 'integer'},
      placeholder: function() {
        return []; 
      }
    }
  }

  it("should set default value for field (placeholder)", function(done) {
    var schema= new Schema(descriptor)
      , source = {};
    schema.validate(source, function() {
      expect(source.list).to.eql([]);
      done();
    });
  });

});
