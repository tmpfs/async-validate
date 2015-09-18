var expect = require('chai').expect
  , Schema = require('../../index');

describe('async-validate:', function() {

  var descriptor = {
    type: 'object',
    fields: {
      name: {type: 'string'},
      age: {type: 'integer', required: false}
    }
  }

  var string = {
    type: 'object',
    fields: {
      mock: {type: 'string', required: false}
    }
  }

  var func = {
    type: 'object',
    fields: {
      mock: {type: 'function', required: false}
    }
  }


  var regexp = {
    type: 'object',
    fields: {
      mock: {type: 'regexp', required: false}
    }
  }

  var float = {
    type: 'object',
    fields: {
      mock: {type: 'float', required: false}
    }
  }

  var number = {
    type: 'object',
    fields: {
      mock: {type: 'number', required: false}
    }
  }

  var object = {
    type: 'object',
    fields: {
      mock: {type: 'object', required: false}
    }
  }

  var arr = {
    type: 'object',
    fields: {
      mock: {type: 'array', required: false}
    }
  }

  var bool = {
    type: 'object',
    fields: {
      mock: {type: 'boolean', required: false}
    }
  }

  var date = {
    type: 'object',
    fields: {
      mock: {type: 'date', required: false}
    }
  }

  var enumerable = {
    type: 'object',
    fields: {
      mock: {type: 'enum', required: false}
    }
  }

  it('should error on invalid integer field if not required (first/single)',
    function(done) {
      var schema = new Schema(descriptor);
      var source = {age: 'abc', name : 'User'};
      var opts = {first : true, single: true};
      schema.validate(source, opts, function(err, res) {
        expect(res.errors.length).to.eql(1);
        expect(res.errors[0].message).to.eql('age is not an integer');
        expect(res.errors[0].field).to.eql('age');
        done();
      });
    }
  );

  it('should allow undefined integer field if not required', function(done) {
    var schema = new Schema(descriptor);
    var source = {age: undefined, name : 'User'};
    var opts = {first : false, single: true};
    schema.validate(source, opts, function(err, res) {
      expect(err).to.eql(null);
      expect(res).to.eql(null);
      done();
    });
  });

  it('should allow undefined integer field if not required (first)',
    function(done) {
      var schema = new Schema(descriptor);
      var source = {age: undefined, name : 'User'};
      var opts = {first : true, single: true};
      schema.validate(source, opts, function(err, res) {
        expect(err).to.eql(null);
        expect(res).to.eql(null);
        done();
      });
    }
  );

  it('should allow undefined array field if not required', function(done) {
    var schema = new Schema(arr);
    var source = {mock: undefined};
    var opts = {};
    schema.validate(source, opts, function(err, res) {
      expect(err).to.eql(null);
      expect(res).to.eql(null);
      done();
    });
  });

  it('should allow undefined boolean field if not required', function(done) {
    var schema = new Schema(bool);
    var source = {mock: undefined};
    var opts = {};
    schema.validate(source, opts, function(err, res) {
      expect(err).to.eql(null);
      expect(res).to.eql(null);
      done();
    });
  });

  it('should allow undefined date field if not required', function(done) {
    var schema = new Schema(date);
    var source = {mock: undefined};
    var opts = {};
    schema.validate(source, opts, function(err, res) {
      expect(err).to.eql(null);
      expect(res).to.eql(null);
      done();
    });
  });

  it('should allow undefined enum field if not required', function(done) {
    var schema = new Schema(enumerable);
    var source = {mock: undefined};
    var opts = {};
    schema.validate(source, opts, function(err, res) {
      expect(err).to.eql(null);
      expect(res).to.eql(null);
      done();
    });
  });

  it('should allow undefined float field if not required', function(done) {
    var schema = new Schema(float);
    var source = {mock: undefined};
    var opts = {};
    schema.validate(source, opts, function(err, res) {
      expect(err).to.eql(null);
      expect(res).to.eql(null);
      done();
    });
  });

  it('should allow undefined function field if not required', function(done) {
    var schema = new Schema(func);
    var source = {mock: undefined};
    var opts = {};
    schema.validate(source, opts, function(err, res) {
      expect(err).to.eql(null);
      expect(res).to.eql(null);
      done();
    });
  });

  it('should allow undefined number field if not required', function(done) {
    var schema = new Schema(number);
    var source = {mock: undefined};
    var opts = {};
    schema.validate(source, opts, function(err, res) {
      expect(err).to.eql(null);
      expect(res).to.eql(null);
      done();
    });
  });

  it('should allow undefined object field if not required', function(done) {
    var schema = new Schema(object);
    var source = {mock: undefined};
    var opts = {};
    schema.validate(source, opts, function(err, res) {
      expect(err).to.eql(null);
      expect(res).to.eql(null);
      done();
    });
  });

  it('should allow undefined regexp field if not required', function(done) {
    var schema = new Schema(regexp);
    var source = {mock: undefined};
    var opts = {};
    schema.validate(source, opts, function(err, res) {
      expect(err).to.eql(null);
      expect(res).to.eql(null);
      done();
    });
  });

  it('should allow undefined string field if not required', function(done) {
    var schema = new Schema(string);
    var source = {mock: undefined};
    var opts = {};
    schema.validate(source, opts, function(err, res) {
      expect(err).to.eql(null);
      expect(res).to.eql(null);
      done();
    });
  });

});
