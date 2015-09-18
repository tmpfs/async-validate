var date = require('./date-pattern').fields.active
  , schema = {
      type: 'object',
      fields: {
        start: date,
        end: date
      }
    }

module.exports = schema;
