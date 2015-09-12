function id(cb) {
  var re = /^[^-][a-zA-Z0-9-]+$/;
  if(!re.test(this.value)) {
    this.raise('%s is not a valid identifier', this.field);
  }
  cb();
}

module.exports = function() {
  // add static `id` type method
  this.main.id = id;
}
