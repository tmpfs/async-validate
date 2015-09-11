/**
 *  Validates an object.
 *
 *  @param opts The validation options.
 *  @param cb The callback function.
 */
function object(opts, cb) {
  var validate = this.rule.required
    || (!this.rule.required && this.source.hasOwnProperty(this.rule.field));

  if(validate) {
    if(this.value === undefined && !this.rule.required) {
      return cb();
    }
    this.required();
    if(this.rule.required || this.value !== undefined) {
      this.type();
    }
  }
  cb(this.errors);
}

module.exports = function() {
  this.main.object = object;
}
