/**
 *  Validates a number.
 *
 *  @param cb The callback function.
 */
function number(cb) {
  if(this.shouldValidate()) {
    this.required();
    // straight typeof check
    if(typeof(this.value) !== this.rule.type) {
      this.raise(
        this.reasons.type,
        this.messages.types[this.rule.type],
        this.field, this.rule.type);
    }
    this.range();
  }
  cb();
}

module.exports = function() {
  this.main.number = number;
}
