function isRegExp(value) {
  if(value instanceof RegExp) {
    return true;
  }
  try {
    new RegExp(value);
    return true;
  }catch(e) {}
  return false;
}

module.exports = function() {

  /**
   *  Validates the regular expression type.
   *
   *  @param cb The callback function.
   */
  this.main.regexp = function regexp(cb) {
    if(this.shouldValidate()) {
      this.required();
      if(!isRegExp(this.value)) {
        this.raise(
          this.reasons.type,
          this.messages.types[this.rule.type], this.field, this.rule.type);
      }
    }
    cb();
  }

}
