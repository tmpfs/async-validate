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
      if(/^\s+$/.test(this.value) || this.value === '') {
        this.raise(
          this.reasons.whitespace,
          this.messages.whitespace, this.field);
      }
    }
  }
  cb();
}

module.exports = function() {
  this.main.string = string;
}
