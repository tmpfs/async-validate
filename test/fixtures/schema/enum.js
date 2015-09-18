var schema = {
  type: 'object',
  fields: {
    role: {type: 'enum', list: ['admin', 'user', 'guest']}
  }
}

module.exports = schema;
