module.exports = function() {

  /**
   *  Validates a value is null.
   *
   *  @param cb The callback function.
   */
  this.main.null = function validate(cb) {
    if(this.validates()) {
      this.required();
      this.type();
    }
    cb();
  }

}
