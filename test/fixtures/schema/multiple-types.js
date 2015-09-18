var Component = require('../component')
  , schema = {
      type: 'object',
      fields: {
        prop: {
          type: [Boolean, 'string', Component, function(){}]
        }
      }
    }

module.exports = schema;
