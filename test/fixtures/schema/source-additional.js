var schema = {
  type: 'object',
  additional: false,
  // trigger code path whereby transform cannot assign inline
  // on root object as there is no parent object to assign to
  transform: function(value) {
    return value; 
  },
  fields: {
    address: {
      type: "object",
      required: true
    }
  }
}

module.exports = schema;
