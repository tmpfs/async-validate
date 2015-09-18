var schema = {
  type: 'object',
  fields: {
    name: {type: 'string', required: true, message: 'Name is required'}
  }
}

module.exports = schema;
