module.exports = function() {

  /**
   *  Validates a regular expression pattern.
   *
   *  Performs validation when a rule only contains
   *  a pattern property but is not declared as a string type.
   *
   *  @param cb The callback function.
   */
  this.main.pattern = function pattern(cb) {
    if(this.validates()) {
      this.pattern();
    }
    cb();
  }

}
