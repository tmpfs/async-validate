var expect = require('chai').expect
  , schema = {
      fields: {
        id: {
          foo: 'bar',
          test: function(cb) {
            expect(this.foo).to.eql('bar');
            cb();
          }
        }
      }
    }

module.exports = schema;
