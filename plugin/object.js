/**
 *  Validates an object.
 *
 *  @param cb The callback function.
 */
function object(cb) {
  var expected, additional;

  if(this.shouldValidate()) {
    this.required();
    this.type();

    // nested deep properties
    if(this.rule.additional === false) {

      // NOTE: Object.keys() will throw if you declare `additional`
      // NOTE: for the `object` type but do not declare nested `fields` object
      expected = Array.isArray(this.rule.keys)
        ? this.rule.keys : Object.keys(this.rule.fields);

      additional = this.hasAdditionalFields(
        expected, Object.keys(this.value));

      if(additional) {
        this.raise(
          this.reasons.additional,
          this.messages.additional, additional.join(', '), this.field);
      }
    }
  }
  cb();
}

module.exports = function() {
  this.main.object = object;
}
