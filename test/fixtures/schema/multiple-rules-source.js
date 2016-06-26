var expect = require('chai').expect;

var email = require('../email') 
  , schema = {
      type: 'object',
      fields: {
        email: [
          {type: 'string', required: true},
          {type: 'string', pattern: email}
        ],
        token: function(cb) {
          expect(this.source.email).to.be.a('string');
          cb();
        }
      }
    }

module.exports = schema;
