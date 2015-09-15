module.exports = function() {

  /**
   *  Validates an object.
   *
   *  @param cb The callback function.
   */
  this.main.object = function object(cb) {
    var expected
      , additional
      , Type = this.rule.Type;

    if(this.validates()) {
      this.required();

      // instanceof comparison on `type` as function
      if(typeof Type === 'function'
        && !(this.value instanceof Type)) {
        this.raise(
          this.reasons.instance,
          this.messages.types.instance,
          this.field, Type.name || 'function (anonymous)');
      // plain object
      }else if(typeof(this.value) !== 'object' || Array.isArray(this.value)) {
        this.raise(
          this.reasons.type,
          this.messages.types[this.rule.type],
          this.field, this.rule.type);
      }

      // nested deep properties
      if(this.rule.additional === false) {

        // NOTE: Object.keys() will throw if you declare `additional`
        // NOTE: for the `object` type but do not declare nested `fields` object
        expected = Object.keys(this.rule.fields);

        additional = this.diff(
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
