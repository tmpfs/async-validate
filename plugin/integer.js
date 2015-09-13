module.exports = function() {

  /**
   *  Validates a number is an integer.
   *
   *  @param cb The callback function.
   */
  this.main.integer = function integer(cb) {
    if(this.validates()) {
      this.required();

      if(typeof(this.value) !== 'number'
        || Number(this.value) !== parseInt(this.value)) {
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
