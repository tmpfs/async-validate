/**
 *  Validates a function.
 *
 *  @param cb The callback function.
 */
function method(cb) {
  if(this.shouldValidate()) {
    this.required();
    this.type();
  }
  cb();
}

module.exports = function() {
  this.main.method = method;
}
