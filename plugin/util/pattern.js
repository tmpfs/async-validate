module.exports = function() {

  /**
   *  Rule for validating a regular expression pattern.
   */
  this.pattern = function pattern() {
    if((this.rule.pattern instanceof RegExp)
      && (!this.rule.pattern.test(this.value))) {
      this.raise(
        this.reasons.pattern,
        this.messages.pattern.mismatch,
        this.field, this.value, this.rule.pattern);
    }
  }

}
