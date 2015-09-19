var schema = {
  type: 'object',
  fields: {
    name: function(cb) {
      this.raise(
        this.reasons.required,
        '%s is a required field', this.field);
      cb();
    }
  }
}

module.exports = schema;
