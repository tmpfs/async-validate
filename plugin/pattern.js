/**
 *  Validates a regular expression pattern.
 *
 *  Performs validation when a rule only contains
 *  a pattern property but is not declared as a string type.
 *
 *  @param cb The callback function.
 */
function pattern(cb) {
  if(this.shouldValidate()) {
    if(this.value === undefined && !this.rule.required) {
      return cb();
    }
    this.pattern();
  }
  cb(this.errors);
}

module.exports = function() {
  this.main.pattern = pattern;
}
