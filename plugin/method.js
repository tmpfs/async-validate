module.exports = function() {

  /**
   *  Validates a function.
   *
   *  @param cb The callback function.
   */
  this.main.method = function method(cb) {
    if(this.shouldValidate()) {
      this.required();
      this.range();
      if(typeof this.value !== 'function') {
        this.raise(
          this.reasons.type,
          this.messages.types[this.rule.type],
          this.field, this.rule.type);
      }
    }
    cb();
  }

}
