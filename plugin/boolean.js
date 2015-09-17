module.exports = function() {

  /**
   *  Validates a boolean.
   *
   *  @param cb The callback function.
   */
  this.main.boolean = function bool(cb) {
    if(this.validates()) {
      this.required();
      this.type();
    }
    cb();
  }

}
