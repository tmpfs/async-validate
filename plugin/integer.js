/**
 *  Validates a number is an integer.
 *
 *  @param cb The callback function.
 */
function integer(cb) {
  if(this.shouldValidate()) {
    if(this.value === undefined && !this.rule.required) {
      return cb();
    }
    this.required();
    this.type();
    this.range();
  }
  cb(this.errors);
}

module.exports = function() {
  this.main.integer = integer;
}
