function isObject(value, Type) {
  if(typeof Type === 'function') {
    return (value instanceof Type);
  }
  return typeof(value) === 'object' && !Array.isArray(value);
}

module.exports = function() {

  /**
   *  Validates an object.
   *
   *  @param cb The callback function.
   */
  this.main.object = function object(cb) {
    var expected, additional;

    if(this.shouldValidate()) {
      this.required();

      if(!isObject(this.value, this.rule.Type)) {
        this.raise(
          this.reasons.type,
          this.messages.types[this.rule.type],
          this.field, this.rule.type);
      }

      // nested deep properties
      if(this.rule.additional === false) {

        // NOTE: Object.keys() will throw if you declare `additional`
        // NOTE: for the `object` type but do not declare nested `fields` object
        expected = Array.isArray(this.rule.keys)
          ? this.rule.keys : Object.keys(this.rule.fields);

        additional = this.hasAdditionalFields(
          expected, Object.keys(this.value));

        if(additional) {
          this.raise(
            this.reasons.additional,
            this.messages.additional, additional.join(', '), this.field);
        }
      }
    }
    cb();
  }

}
