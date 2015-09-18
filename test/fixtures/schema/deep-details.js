var schema = {
  type: 'object',
  fields: {
    name: {type: 'string', required: true},
    address: {
      type: 'object',
      required: true,
      fields: {
        street: {type: 'string', required: true},
        city: {type: 'string', required: true},
        zip: {type: 'string', required: true, len: 8, message: 'invalid zip'}
      }
    }
  }
}

module.exports = schema;
