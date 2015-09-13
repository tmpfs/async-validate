/**
 *  Validates an enumerable list.
 *
 *  @param cb The callback function.
 */
function enumerable(cb) {
  if(this.shouldValidate()) {
    this.required();
    var list = this.rule.list;
    if(!~list.indexOf(this.value)) {
      this.raise(
        this.reasons.enumerable,
        this.messages.enum,
        this.field, list.join(', '));
    }
  }
  cb();
}

module.exports = function() {
  this.main.enum = enumerable;
}
