/**
 *  Validates an array.
 *
 *  @param cb The callback function.
 */
function array(cb) {
  var validate = this.rule.required
    || (!this.rule.required && this.source.hasOwnProperty(this.rule.field));

  if(validate) {
    if(this.value === undefined && !this.rule.required) {
      return cb();
    }

    this.required();

    if(this.rule.required || this.value !== undefined) {
      this.type();
      this.range();
    }
  }
  cb(this.errors);
}

module.exports = function() {
  this.main.array = array;
}
