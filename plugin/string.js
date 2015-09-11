/**
 *  Performs validation for string types.
 *
 *  @param cb The callback function.
 */
function string(cb) {
  if(this.shouldValidate()) {
    this.required();
    this.type();
    this.range();
    this.pattern();

    if(this.rule.whitespace === true) {
      this.whitespace();
    }
  }
  cb(this.errors);
}

module.exports = function() {
  this.main.string = string;
}
