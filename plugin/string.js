/**
 *  Performs validation for string types.
 *
 *  @param cb The callback function.
 */
function string(cb) {
  if(this.shouldValidate()) {
    this.required();

    // if value is required and value is undefined
    // no need to add this error message
    if(this.rule.required && this.value === undefined) {
      return cb();    
    }

    if(typeof this.value !== 'string') {
      this.raise(
        this.reasons.type,
        this.messages.types[this.rule.type],
        this.field, this.rule.type);
    }

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
