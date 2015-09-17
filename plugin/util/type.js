module.exports = function() {

  /**
   *  Rule for validating a value type.
   */
  this.type = function type() {
    var id = this.rule.type
      , Type = this.rule.Type
      , invalid = false;

    if(Array.isArray(id)) {
      console.log('compare multiple types with logical or'); 
    // instanceof comparison on `type` as function
    }else if(typeof(Type) === 'function') {
      if(!(this.value instanceof Type)) {
        this.raise(
          this.reasons.instance,
          this.messages.types.instance,
          this.field, Type.name || 'function (anonymous)');
      }
    // null type
    }else if(id === 'null') {
      invalid = this.value !== null;
    // regexp as RegExp or valid string expression
    }else if(id === 'regexp') {
      if(!(this.value instanceof RegExp)) {
        try {
          new RegExp(this.value);
        }catch(e) {
          invalid = true;
        }
      }
    // string type
    }else if(id === 'string') {
      invalid = typeof this.value !== 'string' && this.validates();
    // object type
    }else if(id === 'object') {
      invalid = (typeof(this.value) !== 'object'
        || Array.isArray(this.value));
    // array type
    }else if(id === 'array') {
      invalid = !Array.isArray(this.value);
    // float type
    }else if(id === 'float') {
      invalid = typeof(this.value) !== 'number'
        || Number(this.value) === parseInt(this.value);
    // integer type
    }else if(id === 'integer') {
      invalid = typeof(this.value) !== 'number'
        || Number(this.value) !== parseInt(this.value);
    }else if(id === 'method') {
      invalid = typeof(this.value) !== 'function';
    // straight typeof test
    }else if(id === 'boolean' || id === 'number') {
      invalid = typeof(this.value) !== id;
    }

    if(invalid) {
      this.raise(
        this.reasons.type,
        this.messages.types[this.rule.type],
        this.field, this.rule.type);
    }
  }
}
