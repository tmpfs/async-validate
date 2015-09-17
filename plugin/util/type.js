module.exports = function() {

  /**
   *  Rule for validating a value type.
   */
  this.type = function type() {
    var id = this.rule.type
      , Type = this.rule.Type
      , invalid = false;

    // instanceof comparison on `type` as function
    if(typeof(Type) === 'function') {
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
    // TODO: rename method -> function so that it can share the 
    // TODO: conditional below
    }else if(id === 'method') {
      invalid = typeof(this.value) !== 'function';
    // straight typeof test
    }else{
      invalid = typeof(this.value) !== id;
    }

    if(invalid) {
      this.raise(
        this.reasons.type,
        this.messages.types[this.rule.type],
        this.field, this.rule.type);
    }
  }

  /**
   *  Validate an array of types using logical or.
   *
   *  @param cb Callback function.
   */
  function types(cb) {
    var types = this.rule.type.slice(0)
      , i
      , type
      , length = this.errors.length
      , invalid;

    if(this.validates()) {
      this.required();

      for(i = 0;i < types.length;i++) {
        type = types[i];
        delete this.rule.Type;
        if(typeof type === 'function') {
          this.rule.Type = type; 
        }
        this.rule.type = type;
        this.type();
      }

      invalid = (this.errors.length - length) === types.length;
      // remove raised errors
      this.errors = this.errors.slice(0, length);

      // all of the type tests failed
      if(invalid) {
        this.raise(
          this.reasons.type,
          this.messages.types.multiple,
          this.field,
          types.map(function(type) {
            if(typeof(type) === 'function') {
              return type.name || 'function (anonymous)';
            }
            return type;
          }).join(', ')
        )
      }
    }
    cb(); 
  }

  this.main.types = types;
}
