module.exports = function() {

  /**
   *  Validates a number is a floating point number.
   *
   *  @param cb The callback function.
   */
  this.main.float = function fraction(cb) {
    if(this.validates()) {
      this.required();
      this.type();
      this.range();
    }
    cb();
  }

}
