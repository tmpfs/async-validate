var email = require('../email')
  , schema = {
      type: 'object',
      fields: {
        email: [
          {type: 'string', required: true},
          {type: 'string', pattern: email}
        ]
      }
    }

module.exports = schema;
