var ptn = /^([\d]{4})-([\d]{2})-([\d]{2})$/
  , schema = {
      type: 'object',
      fields: {
        active: {
          type: 'date',
          format: 'YYYY-MM-DD',
          pattern: ptn
        }
      }
    }

module.exports = schema;
