var expect = require('chai').expect
  , Schema = require('../../index')
  , descriptor = require('../fixtures/schema/internal-error');

describe('async-validate:', function() {

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
