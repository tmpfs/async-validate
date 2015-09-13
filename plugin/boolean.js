/**
 *  Validates a boolean.
 *
 *  @param opts The validation options.
 *  @param cb The callback function.
 */
function bool(cb) {
  if(this.shouldValidate()) {
    this.required();

    // straight typeof check
    if(typeof(this.value) !== this.rule.type) {
      this.raise(
        this.reasons.type,
        this.messages.types[this.rule.type],
        this.field, this.rule.type);
    }
  }
  cb();
}

module.exports = function() {
  this.main.boolean = bool;
}
