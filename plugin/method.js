/**
 *  Validates a function.
 *
 *  @param cb The callback function.
 */
function method(cb) {
  if(this.shouldValidate()) {
    if(this.value === undefined && !this.rule.required) {
      return cb();
    }
    this.required();
    this.type();
  }
  cb(this.errors);
}

module.exports = function() {
  this.main.method = method;
}
