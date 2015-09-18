var expect = require('chai').expect
  , Schema = require('../../index')
  , descriptor = require('../fixtures/schema/parallel');

describe('async-validate:', function() {

  it('should use default series iteration', function(done) {
    var schema = new Schema(descriptor);
    schema.validate({},
      function(err, res) {
        expect(err).to.eql(null);
        expect(res).to.eql(null);
        done();
      }
    );
  });

  it('should use parallel iteration', function(done) {
    var schema = new Schema(descriptor)
    schema.validate({}, {parallel: true},
      function(err, res) {
        expect(err).to.eql(null);
        expect(res).to.eql(null);
        done();
      }
    );
  });

});
