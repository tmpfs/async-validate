module.exports = function() {

  /**
   *  Rule for validating required fields.
   */
  this.required = function required() {
    //console.log('required %s', this.isRoot());
    if((this.isRoot() && this.rule.required && !this.value)
      || !this.isRoot() && this.rule.required
       && (!this.source.hasOwnProperty(this.field)
          || this.value === undefined || this.value === null)) {
      this.raise(
        this.reasons.required,
        this.messages.required, this.field);
    }
  }

}
