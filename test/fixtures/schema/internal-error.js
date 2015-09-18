var schema= {
  type: 'object',
  fields: {
    mock: function(cb) {
      cb(new Error('query error'));  
    },
    next: function() {
      throw new Error('rule validation function invoked unexpectedly'); 
    }
  }
}

module.exports = schema;
