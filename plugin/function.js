module.exports = function() {

  /**
   *  Validates a function.
   *
   *  @param cb The callback function.
   */
  this.main.function = function method(cb) {
    if(this.validates()) {
      this.required();
      this.type();
      this.range();
    }
    cb();
  }

}
