/**
 *  Validates a number is a floating point number.
 *
 *  @param cb The callback function.
 */
function fraction(cb) {
  if(this.shouldValidate()) {
    this.required();
    this.type();
    this.range();
  }
  cb(this.errors);
}

module.exports = function() {
  this.main.float = fraction;
}
