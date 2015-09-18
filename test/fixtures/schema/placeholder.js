var schema = {
  type: 'object',
  fields: {
    list: {
      type: 'array',
      values: {type: 'integer'},
      placeholder: function() {
        return []; 
      }
    }
  }
}

module.exports = schema;
