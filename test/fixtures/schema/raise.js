var schema = {
  type: 'object',
  fields: {
    name: function(cb) {
      this.raise('%s is a required field', this.field);
      cb();
    }
  }
}

module.exports = schema;
