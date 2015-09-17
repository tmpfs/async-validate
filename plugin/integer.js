module.exports = function() {

  /**
   *  Validates a number is an integer.
   *
   *  @param cb The callback function.
   */
  this.main.integer = function integer(cb) {
    if(this.validates()) {
      this.required();
      this.type();
      this.range();
    }
    cb();
  }

}
