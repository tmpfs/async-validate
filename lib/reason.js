function Reason(id, opts) {
  for(var k in opts) {
    this[k] = opts[k];
  }
  this.id = id;
}

function toString() {
  return this.id;
}

Reason.prototype.toString = toString;

var reasons = {
  type: new Reason('type'),
  required: new Reason('required'),
  pattern: new Reason('pattern'),
  length: new Reason('length'),
  additional: new Reason('additional'),
  enumerable: new Reason('enum'),
  date: new Reason('date'),
  whitespace: new Reason('whitespace'),
  min: new Reason('min'),
  max: new Reason('max'),
}

Reason.reasons = reasons;

module.exports = Reason;
