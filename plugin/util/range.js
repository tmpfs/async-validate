module.exports = function() {

  /**
   *  Rule for validating minimum and maximum allowed values.
   */
  this.range = function range() {
    var rule = this.rule
      , value = this.value
      , val = value
      , key = null
      , arr = Array.isArray(value)
      , len = typeof rule.len === 'number'
      , min = typeof rule.min === 'number'
      , max = typeof rule.max === 'number'
      , num = typeof(value) === 'number'
      , str = typeof(value) === 'string'
      , fun = typeof(value) === 'function';

    if(num || str || fun) {
      key = typeof(value);
    }else if(arr) {
      key = 'array';
    }

    // if the value is not a supported range type ignore validation
    if(!key) {
      return false;
    }

    // use `length` property of `value`
    if(str || arr || fun) {
      val = value.length;
    }

    // length equality test
    if(len && (val !== rule.len)) {
      this.raise(
        this.reasons.length,
        this.messages[key].len, this.field, rule.len);
    // minimum value 
    }else if(min && !max && val < rule.min ) {
      this.raise(
        this.reasons.min,
        this.messages[key].min, this.field, rule.min);
    // maximum value 
    }else if( max && !min && val > rule.max ) {
      this.raise(
        this.reasons.max,
        this.messages[key].max, this.field, rule.max);
    // range test
    }else if(min && max && (val < rule.min || val > rule.max) ) {
      this.raise(
        val < rule.min ? this.reasons.min : this.reasons.max,
        this.messages[key].range, this.field, rule.min, rule.max);
    }
  }

}
