module.exports = function() {

  /**
   *  Validates an array.
   *
   *  @param cb The callback function.
   */
  this.main.array = function array(cb) {
    if(this.validates()) {
      this.required();
      if(!Array.isArray(this.value)) {
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
