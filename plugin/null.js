module.exports = function() {
  this.main.null = function validate(cb) {
    if(this.shouldValidate()) {
      this.required();
      this.type();
    }
    cb();
  }
}
