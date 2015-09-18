var schema = {
  type: 'object',
  fields: {
    address: {
      type: 'object',
      fields: {
        street: {type: 'string', required: true},
        city: {type: 'string', required: true},
        zip: {type: 'string', required: true, len: 8, message: 'Invalid zip'}
      }
    }
  }
}

module.exports = schema;
