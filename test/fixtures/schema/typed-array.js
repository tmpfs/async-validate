var value = require('../value-message')
  , schema = {
      type: 'object',
      fields: {
        list: {
          type: 'array',
          values: {
            type: 'integer',
            message: value
          }
        }
      }
    }

module.exports = schema;
