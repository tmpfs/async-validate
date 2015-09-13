module.exports = function() {

  /**
   *  Validates a value is null.
   *
   *  @param cb The callback function.
   */
  this.main.null = function validate(cb) {
    if(this.shouldValidate()) {
      this.required();
      if(this.value !== null) {
        this.raise(
          this.reasons.type,
          this.messages.types[this.rule.type],
          this.field, this.rule.type);
      } 
    }
    cb();
  }

}
