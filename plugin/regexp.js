/**
 *  Validates the regular expression type.
 *
 *  @param opts The validation options.
 *  @param cb The callback function.
 */
function regexp(opts, cb) {
  var validate = this.rule.required
    || (!this.rule.required && this.source.hasOwnProperty(this.rule.field));

  if(validate) {
    if(this.value === undefined && !this.rule.required) {
      return cb();
    }
    this.required();
    this.type();
  }
  cb(this.errors);
}

module.exports = function() {
  this.main.regexp = regexp;
}
