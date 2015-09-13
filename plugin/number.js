module.exports = function() {

  /**
   *  Validates a number.
   *
   *  @param cb The callback function.
   */
  this.main.number = function number(cb) {
    if(this.validates()) {
      this.required();
      // straight typeof check
      if(typeof(this.value) !== this.rule.type) {
        this.raise(
          this.reasons.type,
          this.messages.types[this.rule.type],
          this.field, this.rule.type);
      }
      this.range();
    }
    cb();
  }

}
