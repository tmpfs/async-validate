/**
 *  Validates the regular expression type.
 *
 *  @param cb The callback function.
 */
function regexp(cb) {
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
  this.main.regexp = regexp;
}
