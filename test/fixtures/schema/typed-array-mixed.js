var value = require('../value-message')
  , schema = {
      type: 'object',
      fields: {
        list: {
          type: 'array',
          values: [
            {type: 'integer', message: value},
            {type: 'string', message: value},
            {type: 'float', message: value}
          ]
        }
      }
    }

module.exports = schema;
