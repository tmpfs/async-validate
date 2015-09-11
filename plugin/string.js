/**
 *  Performs validation for string types.
 *
 *  @param opts The validation options.
 *  @param cb The callback function.
 */
function string(opts, cb) {
  var validate = this.rule.required
    || (!this.rule.required && this.source.hasOwnProperty(this.rule.field));

  if(validate) {
    if(this.value === undefined && !this.rule.required) {
      return cb();
    }

    this.required();
    this.type();
    this.range();
    this.pattern();

    if(this.rule.whitespace === true) {
      this.whitespace();
    }
  }
  cb(this.errors);
}

module.exports = function() {
  this.main.string = string;
}
