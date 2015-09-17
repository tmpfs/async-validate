module.exports = function() {

  /**
   *  Validates an object.
   *
   *  @param cb The callback function.
   */
  this.main.object = function object(cb) {
    var expected
      , additional;
    if(this.validates()) {
      this.required();
      this.type();

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
