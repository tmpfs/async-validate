/**
 *  Validates an enumerable list.
 *
 *  @param opts The validation options.
 *  @param cb The callback function.
 */
function enumerable(opts, cb) {
  var validate = this.rule.required
    || (!this.rule.required && this.source.hasOwnProperty(this.rule.field));
  if(validate) {
    if(this.value === undefined && !this.rule.required) {
      return cb();
    }

    this.required();
    this.enumerable();
  }
  cb(this.errors);
}

module.exports = function() {
  this.main.enum = enumerable;
}
