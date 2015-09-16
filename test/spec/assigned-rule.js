var expect = require('chai').expect
  , Schema = require('../../index');

describe('async-validate:', function() {

  var descriptor = {
    flag: {type: 'boolean'},
  }

  var descriptor = {
    id: {
      foo: 'bar',
      test: function(cb) {
        expect(this.foo).to.eql('bar');
        cb();
      }
    }
  }

  it('should access rule property from validator function', function(done) {
    var schema = new Schema(descriptor);
    schema.validate({id: 'mock'}, function(err, res) {
      done();
    });
  });

});
