var expect = require('chai').expect
  , schema = {
      type: 'object',
      fields: {
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
            expect(this.state.email).to.be.an('object');
            expect(this.state.email.user).to.eql('user');
            expect(this.state.email.domain).to.eql('example.com');
            cb();
          }
        ]
      }
    }

module.exports = schema;
