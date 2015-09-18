var schema = {
  type: 'object',
  fields: {
    firstname: {type: 'string', required: true},
    surname: {type: 'string', required: true}
  }
}

module.exports = schema;
