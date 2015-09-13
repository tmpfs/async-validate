/**
 *  Validates a number is a floating point number.
 *
 *  @param cb The callback function.
 */
function fraction(cb) {
  if(this.shouldValidate()) {
    this.required();

    if(typeof(this.value) !== 'number'
      || Number(this.value) === parseInt(this.value)) {
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
  this.main.float = fraction;
}
