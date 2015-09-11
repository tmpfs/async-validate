/**
 *  Validates a boolean.
 *
 *  @param opts The validation options.
 *  @param cb The callback function.
 */
function bool(cb) {
  if(this.shouldValidate()) {
    this.required();
    this.type();
  }
  cb(this.errors);
}

module.exports = function() {
  this.main.boolean = bool;
}
