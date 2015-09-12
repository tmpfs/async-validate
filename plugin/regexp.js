/**
 *  Validates the regular expression type.
 *
 *  @param cb The callback function.
 */
function regexp(cb) {
  if(this.shouldValidate()) {
    this.required();
    this.type();
  }
  cb();
}

module.exports = function() {
  this.main.regexp = regexp;
}
