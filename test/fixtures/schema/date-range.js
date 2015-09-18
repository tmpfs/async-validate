var date = require('./date-pattern').fields.active
  , schema = {
      fields: {
        start: date,
        end: date
      }
    }

module.exports = schema;
