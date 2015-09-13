module.exports = function() {

  /**
   *  Validates a number is a floating point number.
   *
   *  @param cb The callback function.
   */
  this.main.float = function fraction(cb) {
    if(this.validates()) {
      this.required();

      if(typeof(this.value) !== 'number'
        || Number(this.value) === parseInt(this.value)) {
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
