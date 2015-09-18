var expect = require('chai').expect
  , Schema = require('../../index');

describe('async-validate:', function() {

  var state = {}
    , opts = {state: state}
    , descriptor = {
      email: [
        {type: 'string', required: true, pattern: /^.+@.+\..+/},
        function parse(cb) {
          var at = this.value.indexOf('@')
            , user = this.value.substr(0, at)
            , domain = this.value.substr(at + 1);
          // assign to validation state
          this.state.email = {user: user, domain: domain};
          cb(); 
        },
        function assert(cb) {
          expect(this.state).to.equal(state);    
          expect(this.state.email).to.be.an('object');
          expect(this.state.email.user).to.eql('user');
          expect(this.state.email.domain).to.eql('example.com');
          cb();
        }
      ]
    }
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
