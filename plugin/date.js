/**
 *  Rule for validating a date against a format.
 */
function validator() {
  var moment = require('moment');
  var mmt = this.rule.local ? moment : moment.utc;
  var dt = !this.rule.format
    ? mmt(new Date(this.value)) : mmt(this.value, this.rule.format);
  if(!dt.isValid()) {
    if(this.rule.format) {
      this.raise(
        this.messages.date.format,
          this.field, this.value, this.rule.format);
    }else{
      this.raise(
        this.messages.date.invalid, this.field, this.value);
    }
  }
}

module.exports = function() {

  /**
   *  Validates a date against the format property.
   *
   *  @param cb The callback function.
   */
  this.main.date = function date(cb) {
    var validate = this.isRoot() || this.rule.required
      || (!this.rule.required && this.source.hasOwnProperty(this.field)
            && this.source[this.field]);

    if(validate) {
      this.required();
      this.pattern();
      validator.call(this);
    }

    cb();
  }

}
