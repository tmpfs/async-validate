/**
 *  Validates an object.
 *
 *  @param cb The callback function.
 */
function object(cb) {
  var additional;

  if(this.shouldValidate()) {
    this.required();
    this.type();

    if(this.rule.additional === false
      && this.rule.fields
      && typeof this.rule.fields === 'object') {

      additional = this.hasAdditionalFields(
        Object.keys(this.rule.fields), Object.keys(this.value));

      if(additional) {
        //console.dir('additional error');
        this.reason(this.reasons.additional);
        this.raise(this.messages.additional, additional.join(', '), this.field);
      }
    }
  }

  cb(this.errors);
}

module.exports = function() {
  this.main.object = object;
}
