var schema = {
  type: 'object',
  required: true,
  fields: {
    all: {
      match: /./,
      type: 'string'
    }
  }
}

module.exports = schema;
