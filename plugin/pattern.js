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
    this.pattern();
  }
  cb();
}

module.exports = function() {
  this.main.pattern = pattern;
}
