var schema = {
  type: 'object',
  required: true,
  fields: {
    all: {
      match: /^address[1-3]$/,
      type: 'string'
    }
  }
}

module.exports = schema;
