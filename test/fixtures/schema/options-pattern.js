var schema = {
  type: 'object',
  fields: {
    name: {type: 'string', required: true, min: 10, pattern: /^[^-].*$/}
  }
}

module.exports = schema;
