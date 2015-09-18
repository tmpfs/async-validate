var expect = require('chai').expect
  , Schema = require('../../index')
  , descriptor = require('../fixtures/schema/state');

describe('async-validate:', function() {

  var state = {}
    , opts = {state: state}
    , source = {email: 'user@example.com'};

  it('should pass state information between rules', function(done) {
    var schema = new Schema(descriptor);
    schema.validate(source, opts, function() {
      expect(state.email).to.be.an('object');
      expect(state.email.user).to.eql('user');
      expect(state.email.domain).to.eql('example.com');
      done();
    });
  });

});
