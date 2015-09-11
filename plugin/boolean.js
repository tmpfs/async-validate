/**
 *  Validates a boolean.
 *
 *  @param opts The validation options.
 *  @param cb The callback function.
 */
function bool(cb) {
  if(this.shouldValidate()) {
    if(this.value === undefined && !this.rule.required) {
      return cb();
    }

    this.required();
    this.type();
  }
  cb(this.errors);
}

module.exports = function() {
  this.main.boolean = bool;
}
