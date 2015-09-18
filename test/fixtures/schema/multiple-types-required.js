var Component = require('../component')
  , schema = {
      type: 'object',
      fields: {
        prop: {
          type: [Boolean, 'string', Component, function(){}],
          required: true
        }
      }
    }

module.exports = schema;
