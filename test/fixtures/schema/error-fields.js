var schema = {
  type: 'object',
  fields: {
    name: {
      type: 'string',
      required: true
    },
    address: {
      type: 'object', 
      fields: {
        name: {
          type: 'string',
          required: true
        } 
      }
    }
  }
}

module.exports = schema;
