/**
 *  Validates an array.
 *
 *  @param cb The callback function.
 */
function array(cb) {
  if(this.shouldValidate()) {
    this.required();

    if(this.rule.required || this.value !== undefined) {
      this.type();
      this.range();
    }
  }
  cb(this.errors);
}

module.exports = function() {
  this.main.array = array;
}
