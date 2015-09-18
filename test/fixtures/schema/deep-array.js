var schema = {
  type: 'object',
  fields: {
    roles: {
      type: 'array', required: true, len: 3,
      fields: {
        0: {type: 'string', required: true},
        1: {type: 'string', required: true},
        2: {type: 'string', required: true}
      }
    }
  }
}

module.exports = schema;
