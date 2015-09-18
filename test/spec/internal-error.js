var expect = require('chai').expect
  , Schema = require('../../index');

describe('async-validate:', function() {

  var descriptor = {
    mock: function(cb) {
      cb(new Error('query error'));  
    },
    next: function() {
      throw new Error('rule validation function invoked unexpectedly'); 
    }
  }

  it('should callback with error', function(done) {
    var schema = new Schema(descriptor);
    schema.validate({}, function(err) {
      function fn() {
        throw err;
      }
      expect(fn).throws(Error);
      expect(fn).throws(/query error/);
      done();
    });
  });

});
