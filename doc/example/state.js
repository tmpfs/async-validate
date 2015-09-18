// pass state information between rule test functions
var Schema = require('../..')
  , dns = require('dns')
  , state = {}
  , opts = {state: state}
  , descriptor = {
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
          function lookup(cb) {
            function resolve(err, addr) {
              if(err && err.code === 'ENOTFOUND') {
                this.raise(
                  '%s: could not resolve dns for domain %s',
                  this.field,
                  this.state.email.domain);
              }else if(err) {
                return cb(err); 
              }
              this.state.addr = addr;
              cb(); 
            }
            dns.resolve(this.state.email.domain, resolve.bind(this));
          }
        ]
      }
    }
  // force dns failure with random domain
  , source = {email: 'foo@' + Date.now() + '.com'}
  , schema;

require('../../plugin/all');

schema = new Schema(descriptor);
schema.validate(source, opts, function(err, res) {
  console.dir(res.errors);
});
