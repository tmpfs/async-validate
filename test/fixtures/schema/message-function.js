var expect = require('chai').expect
  , schema = {
      type: 'object',
      fields: {
        name: {
          type: 'string',
          required: true,
          message: function(message, parameters) {
            expect(message).to.be.a('string');
            expect(parameters).to.be.an('array');
            return 'Name is required';
          }
        }
      }
    }

module.exports = schema;
