var schema = {
  type: 'object',
  fields: {
    name: {
      type: 'string',
      required: true, pattern: /^[a-z]+$/,
      transform: function(value) {
        return value.trim();
      }
    }
  }
}

module.exports = schema;
