var Component = require('../component')
  , schema = {
      type: 'object',
      fields: {
        instance: {
          type: Component
        }
      }
    }

module.exports = schema;
