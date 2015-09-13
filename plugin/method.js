/**
 *  Validates a function.
 *
 *  @param cb The callback function.
 */
function method(cb) {
  if(this.shouldValidate()) {
    this.required();
    if(typeof this.value !== 'function') {
      this.raise(
        this.reasons.type,
        this.messages.types[this.rule.type],
        this.field, this.rule.type);
    }
  }
  cb();
}

module.exports = function() {
  this.main.method = method;
}
