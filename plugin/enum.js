/**
 *  Validates an enumerable list.
 *
 *  @param cb The callback function.
 */
function enumerable(cb) {
  if(this.shouldValidate()) {
    this.required();
    this.enumerable();
  }
  cb();
}

module.exports = function() {
  this.main.enum = enumerable;
}
