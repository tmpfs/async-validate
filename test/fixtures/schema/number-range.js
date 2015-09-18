var schema = {
  type: 'object',
  fields: {
    port: {type: 'number', min: 80, max: 1024}
  }
}

module.exports = schema;
