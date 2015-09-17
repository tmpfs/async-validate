module.exports = function() {

  /**
   *  Validates a number.
   *
   *  @param cb The callback function.
   */
  this.main.number = function number(cb) {
    if(this.validates()) {
      this.required();
      this.type();
      this.range();
    }
    cb();
  }

}
