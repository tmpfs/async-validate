/**
 *  Validates an enumerable list.
 *
 *  @param cb The callback function.
 */
function enumerable(cb) {
  if(this.shouldValidate()) {
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
