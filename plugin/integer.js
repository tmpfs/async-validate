/**
 *  Validates a number is an integer.
 *
 *  @param cb The callback function.
 */
function integer(cb) {
  if(this.shouldValidate()) {
    this.required();
    this.type();
    this.range();
  }
  cb();
}

module.exports = function() {
  this.main.integer = integer;
}
