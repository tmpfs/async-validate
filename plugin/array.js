module.exports = function() {

  /**
   *  Validates an array.
   *
   *  @param cb The callback function.
   */
  this.main.array = function array(cb) {
    if(this.validates()) {
      this.required();
      this.type();
      this.range();
    }
    cb();
  }

}
