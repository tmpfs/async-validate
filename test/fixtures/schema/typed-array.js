var value = require('../value-message')
  , schema = {
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
