/**
 *  Validates an array.
 *
 *  @param cb The callback function.
 */
function array(cb) {
  if(this.shouldValidate()) {
    this.required();
    if(!Array.isArray(this.value)) {
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
  this.main.array = array;
}
