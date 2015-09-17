function Reason(id, meta) {
  for(var k in meta) {
    this[k] = meta[k];
  }
  this.id = id;
}

Reason.prototype.toString = function() {
  return this.id;
}

var reasons = {
  type: new Reason('type'),
  required: new Reason('required'),
  pattern: new Reason('pattern'),
  length: new Reason('length'),
  instance: new Reason('instanceof'),
  additional: new Reason('additional'),
  enumerable: new Reason('enum'),
  date: new Reason('date'),
  whitespace: new Reason('whitespace'),
  min: new Reason('min'),
  max: new Reason('max')
}

Reason.reasons = reasons;

module.exports = Reason;
