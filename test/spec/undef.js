var assert = require('chai').assert
  , expect = require('chai').expect;

var schema = require('../../index');

describe("async-validate:", function() {

  it("should allow undefined integer field if not required", function(done) {
    var descriptor = {
      name: {type: 'string'},
      age: {type: 'integer', required: false}
    }
    var validator = new schema(descriptor);
    var source = {age: undefined, name : "User"};
    var opts = {first : false, single: true};
    validator.validate(source, opts, function(errors, fields) {
      assert.isNull(errors);
      assert.isNull(fields);
      done();
    });
  });

  it("should allow undefined integer field if not required (first)",
    function(done) {
      var descriptor = {
        name: {type: 'string'},
        age: {type: 'integer', required: false}
      }
      var validator = new schema(descriptor);
      var source = {age: undefined, name : "User"};
      var opts = {first : true, single: true};
      validator.validate(source, opts, function(errors, fields) {
        assert.isNull(errors);
        assert.isNull(fields);
        done();
      });
    }
  );

  it("should error on invalid integer field if not required (first/single)",
    function(done) {
      var descriptor = {
        name: {type: 'string'},
        age: {type: 'integer', required: false}
      }
      var validator = new schema(descriptor);
      var source = {age: 'abc', name : "User"};
      var opts = {first : true, single: true};
      validator.validate(source, opts, function(errors, fields) {
        assert.equal(errors.length, 1);
        assert.equal(errors[0].message, "age is not an integer");
        assert.equal(errors[0].field, 'age');
        done();
      });
    }
  );


  it("should allow undefined array field if not required", function(done) {
    var descriptor = {
      mock: {type: 'array', required: false}
    }
    var validator = new schema(descriptor);
    var source = {mock: undefined};
    var opts = {};
    validator.validate(source, opts, function(errors, fields) {
      expect(errors).to.eql(null);
      done();
    });
  });

  it("should allow undefined boolean field if not required", function(done) {
    var descriptor = {
      mock: {type: 'boolean', required: false}
    }
    var validator = new schema(descriptor);
    var source = {mock: undefined};
    var opts = {};
    validator.validate(source, opts, function(errors, fields) {
      expect(errors).to.eql(null);
      done();
    });
  });

  it("should allow undefined date field if not required", function(done) {
    var descriptor = {
      mock: {type: 'date', required: false}
    }
    var validator = new schema(descriptor);
    var source = {mock: undefined};
    var opts = {};
    validator.validate(source, opts, function(errors, fields) {
      expect(errors).to.eql(null);
      done();
    });
  });

  it("should allow undefined enum field if not required", function(done) {
    var descriptor = {
      mock: {type: 'enum', required: false}
    }
    var validator = new schema(descriptor);
    var source = {mock: undefined};
    var opts = {};
    validator.validate(source, opts, function(errors, fields) {
      expect(errors).to.eql(null);
      done();
    });
  });

  it("should allow undefined float field if not required", function(done) {
    var descriptor = {
      mock: {type: 'float', required: false}
    }
    var validator = new schema(descriptor);
    var source = {mock: undefined};
    var opts = {};
    validator.validate(source, opts, function(errors, fields) {
      expect(errors).to.eql(null);
      done();
    });
  });

  it("should allow undefined method field if not required", function(done) {
    var descriptor = {
      mock: {type: 'method', required: false}
    }
    var validator = new schema(descriptor);
    var source = {mock: undefined};
    var opts = {};
    validator.validate(source, opts, function(errors, fields) {
      expect(errors).to.eql(null);
      done();
    });
  });

  it("should allow undefined number field if not required", function(done) {
    var descriptor = {
      mock: {type: 'number', required: false}
    }
    var validator = new schema(descriptor);
    var source = {mock: undefined};
    var opts = {};
    validator.validate(source, opts, function(errors, fields) {
      expect(errors).to.eql(null);
      done();
    });
  });

  it("should allow undefined object field if not required", function(done) {
    var descriptor = {
      mock: {type: 'object', required: false}
    }
    var validator = new schema(descriptor);
    var source = {mock: undefined};
    var opts = {};
    validator.validate(source, opts, function(errors, fields) {
      expect(errors).to.eql(null);
      done();
    });
  });

  it("should allow undefined pattern field if not required", function(done) {
    var descriptor = {
      mock: {type: 'pattern', required: false}
    }
    var validator = new schema(descriptor);
    var source = {mock: undefined};
    var opts = {};
    validator.validate(source, opts, function(errors, fields) {
      expect(errors).to.eql(null);
      done();
    });
  });

  it("should allow undefined regexp field if not required", function(done) {
    var descriptor = {
      mock: {type: 'regexp', required: false}
    }
    var validator = new schema(descriptor);
    var source = {mock: undefined};
    var opts = {};
    validator.validate(source, opts, function(errors, fields) {
      expect(errors).to.eql(null);
      done();
    });
  });

  it("should allow undefined string field if not required", function(done) {
    var descriptor = {
      mock: {type: 'string', required: false}
    }
    var validator = new schema(descriptor);
    var source = {mock: undefined};
    var opts = {};
    validator.validate(source, opts, function(errors, fields) {
      expect(errors).to.eql(null);
      done();
    });
  });

});
