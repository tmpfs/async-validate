var schema = {
  type: 'object',
  fields: {
    address: {
      type: 'object',
      required: true,
      fields: {
        house: {
          type: 'object',
          required: true,
          fields: {
            name: {type: 'string', required: true},
            number: {type: 'string', required: true}
          }
        }
      }
    }
  }
}

module.exports = schema;
