module.exports = function() {

  /**
   *  Performs validation for string types.
   *
   *  @param cb The callback function.
   */
  this.main.string = function string(cb) {
    if(this.validates() || this.rule.pattern) {
      this.required();

      // if value is required and value is undefined
      // no need to add other error messages
      if(this.rule.required && this.value === undefined) {
        return cb();
      }

      this.type();
      this.range();
      this.pattern();

      if(this.rule.whitespace) {
        if(/^\s+$/.test(this.value) || this.value === '') {
          this.raise(
            this.reasons.whitespace,
            this.messages.whitespace, this.field);
        }
      }
    }
    cb();
  }
}
