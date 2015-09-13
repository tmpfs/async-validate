module.exports = function() {

  /**
   *  Rule for validating minimum and maximum allowed values.
   */
  this.range = function range() {
    var rule = this.rule
      , value = this.value;

    var len = typeof rule.len === 'number';
    var min = typeof rule.min === 'number';
    var max = typeof rule.max === 'number';
    var val = value;
    var key = null;
    var num = typeof(value) === 'number';
    var str = typeof(value) === 'string';
    var arr = Array.isArray(value);
    if(num) {
      key = 'number';
    }else if(str) {
      key = 'string';
    }else if(arr) {
      key = 'array';
    }
    // if the value is not of a supported type for range validation
    // the validation rule rule should use the
    // type property to also test for a particular type
    if(!key) {
      return false;
    }
    if(str || arr) {
      val = value.length;
    }
    if(len && (val !== rule.len)) {
      this.raise(
        this.reasons.length,
        this.messages[key].len, this.field, rule.len);
    }else if(min && !max && val < rule.min ) {
      this.raise(
        this.reasons.min,
        this.messages[key].min, this.field, rule.min);
    }else if( max && !min && val > rule.max ) {
      this.raise(
        this.reasons.max,
        this.messages[key].max, this.field, rule.max);
    }else if(min && max && (val < rule.min || val > rule.max) ) {
      this.raise(
        val < rule.min ? this.reasons.min : this.reasons.max,
        this.messages[key].range, this.field, rule.min, rule.max);
    }
  }

}
