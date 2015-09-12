/**
 *  Validates an array.
 *
 *  @param cb The callback function.
 */
function array(cb) {
  if(this.shouldValidate()) {
    this.required();
    this.type();
    this.range();
  }
  cb();
}

module.exports = function() {
  this.main.array = array;
}
