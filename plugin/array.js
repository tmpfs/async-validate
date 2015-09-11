/**
 *  Validates an array.
 *
 *  @param cb The callback function.
 */
function array(cb) {
  if(this.shouldValidate()) {
    if(this.value === undefined && !this.rule.required) {
      return cb();
    }

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
