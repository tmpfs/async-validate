/**
 *  Validates a number.
 *
 *  @param cb The callback function.
 */
function number(cb) {
  if(this.shouldValidate()) {
    this.required();
    this.type();
    this.range();
  }
  cb(this.errors);
}

module.exports = function() {
  this.main.number = number;
}
