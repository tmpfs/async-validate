/**
 *  Validates an object.
 *
 *  @param cb The callback function.
 */
function object(cb) {
  if(this.shouldValidate()) {
    this.required();
    if(this.rule.required || this.value !== undefined) {
      this.type();
    }
  }
  cb(this.errors);
}

module.exports = function() {
  this.main.object = object;
}
