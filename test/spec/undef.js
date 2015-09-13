var expect = require('chai').expect
  , Schema = require('../../index');

describe("async-validate:", function() {

  it("should allow undefined integer field if not required", function(done) {
    var descriptor = {
      name: {type: 'string'},
      age: {type: 'integer', required: false}
    }
    var schema = new Schema(descriptor);
    var source = {age: undefined, name : "User"};
    var opts = {first : false, single: true};
    schema.validate(source, opts, function(errors, fields) {
      expect(errors).to.eql(null);
      done();
    });
  });

  it("should allow undefined integer field if not required (first)",
    function(done) {
      var descriptor = {
        name: {type: 'string'},
        age: {type: 'integer', required: false}
      }
      var schema = new Schema(descriptor);
      var source = {age: undefined, name : "User"};
      var opts = {first : true, single: true};
      schema.validate(source, opts, function(errors, fields) {
        expect(errors).to.eql(null);
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
      var schema = new Schema(descriptor);
      var source = {age: 'abc', name : "User"};
      var opts = {first : true, single: true};
      schema.validate(source, opts, function(errors, fields) {
        expect(errors.length).to.eql(1);
        expect(errors[0].message).to.eql('age is not an integer');
        expect(errors[0].field).to.eql('age');
        done();
      });
    }
  );


  it("should allow undefined array field if not required", function(done) {
    var descriptor = {
      mock: {type: 'array', required: false}
    }
    var schema = new Schema(descriptor);
    var source = {mock: undefined};
    var opts = {};
    schema.validate(source, opts, function(errors, fields) {
      expect(errors).to.eql(null);
      done();
    });
  });

  it("should allow undefined boolean field if not required", function(done) {
    var descriptor = {
      mock: {type: 'boolean', required: false}
    }
    var schema = new Schema(descriptor);
    var source = {mock: undefined};
    var opts = {};
    schema.validate(source, opts, function(errors, fields) {
      expect(errors).to.eql(null);
      done();
    });
  });

  it("should allow undefined date field if not required", function(done) {
    var descriptor = {
      mock: {type: 'date', required: false}
    }
    var schema = new Schema(descriptor);
    var source = {mock: undefined};
    var opts = {};
    schema.validate(source, opts, function(errors, fields) {
      expect(errors).to.eql(null);
      done();
    });
  });

  it("should allow undefined enum field if not required", function(done) {
    var descriptor = {
      mock: {type: 'enum', required: false}
    }
    var schema = new Schema(descriptor);
    var source = {mock: undefined};
    var opts = {};
    schema.validate(source, opts, function(errors, fields) {
      expect(errors).to.eql(null);
      done();
    });
  });

  it("should allow undefined float field if not required", function(done) {
    var descriptor = {
      mock: {type: 'float', required: false}
    }
    var schema = new Schema(descriptor);
    var source = {mock: undefined};
    var opts = {};
    schema.validate(source, opts, function(errors, fields) {
      expect(errors).to.eql(null);
      done();
    });
  });

  it("should allow undefined method field if not required", function(done) {
    var descriptor = {
      mock: {type: 'method', required: false}
    }
    var schema = new Schema(descriptor);
    var source = {mock: undefined};
    var opts = {};
    schema.validate(source, opts, function(errors, fields) {
      expect(errors).to.eql(null);
      done();
    });
  });

  it("should allow undefined number field if not required", function(done) {
    var descriptor = {
      mock: {type: 'number', required: false}
    }
    var schema = new Schema(descriptor);
    var source = {mock: undefined};
    var opts = {};
    schema.validate(source, opts, function(errors, fields) {
      expect(errors).to.eql(null);
      done();
    });
  });

  it("should allow undefined object field if not required", function(done) {
    var descriptor = {
      mock: {type: 'object', required: false}
    }
    var schema = new Schema(descriptor);
    var source = {mock: undefined};
    var opts = {};
    schema.validate(source, opts, function(errors, fields) {
      expect(errors).to.eql(null);
      done();
    });
  });

  it("should allow undefined pattern field if not required", function(done) {
    var descriptor = {
      mock: {type: 'pattern', required: false}
    }
    var schema = new Schema(descriptor);
    var source = {mock: undefined};
    var opts = {};
    schema.validate(source, opts, function(errors, fields) {
      expect(errors).to.eql(null);
      done();
    });
  });

  it("should allow undefined regexp field if not required", function(done) {
    var descriptor = {
      mock: {type: 'regexp', required: false}
    }
    var schema = new Schema(descriptor);
    var source = {mock: undefined};
    var opts = {};
    schema.validate(source, opts, function(errors, fields) {
      expect(errors).to.eql(null);
      done();
    });
  });

  it("should allow undefined string field if not required", function(done) {
    var descriptor = {
      mock: {type: 'string', required: false}
    }
    var schema = new Schema(descriptor);
    var source = {mock: undefined};
    var opts = {};
    schema.validate(source, opts, function(errors, fields) {
      expect(errors).to.eql(null);
      done();
    });
  });

});
