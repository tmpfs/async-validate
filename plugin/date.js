var format = require('../lib/format')
  , moment = require('moment');

/**
 *  Rule for validating a date against a format.
 */
function validator() {
  if(!this.rule.required
     && (this.value === undefined || this.value === '')) {
    return false;
  }

  var mmt = this.rule.local ? moment : moment.utc;
  var dt = !this.rule.format
    ? mmt(new Date(this.value)) : mmt(this.value, this.rule.format);
  //console.log('value %s', value);
  //console.log('format %s', rule.format);
  //console.log('date %s', dt);
  //console.log('date valid %s', dt.isValid());
  if(!dt) {
    this.raise(
      format(this.messages.date.parse, this.field, this.value));
  }else if(!dt.isValid()) {
    if(this.rule.format) {
      this.raise(
        format(this.messages.date.format,
          this.field, this.value, this.rule.format));
    }else{
      this.raise(
        format(this.messages.date.invalid, this.field, this.value));
    }
  }

  return true;
}

/**
 *  Validates a date against the format property.
 *
 *  @param cb The callback function.
 */
function date(cb) {
  var validate = this.rule.required
    || (!this.rule.required && this.source.hasOwnProperty(this.field)
          && this.source[this.field]);
  if(validate) {
    this.required();
    this.pattern();
    validator.call(this);
  }
  cb(this.errors);
}

module.exports = function() {
  this.main.date = date;
}
