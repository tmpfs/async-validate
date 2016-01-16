module.exports = function() {

  /**
   *  Rule for validating required fields.
   */
  this.required = function required() {
    if(!this.isRoot()
      && this.rule.required
      && (!this.source.hasOwnProperty(this.field)
        || this.value === undefined)) {
      this.raise(
        this.reasons.required,
        this.messages.required, this.field);
    }
  }

}
