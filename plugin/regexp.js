module.exports = function() {

  /**
   *  Validates the regular expression type.
   *
   *  @param cb The callback function.
   */
  this.main.regexp = function regexp(cb) {
    if(this.validates()) {
      this.required();
      this.type();
    }
    cb();
  }

}
