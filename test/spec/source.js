var expect = require('chai').expect
  , schema = require('../../index');

describe("async-validate:", function() {

  it("should error on source as array type", function(done) {
    var descriptor = {type: 'array'}
      , validator = new schema(descriptor)
      , source = 'foo';

    validator.validate(source, function(err, res) {
      expect(err).to.eql(null);
      expect(res.errors.length).to.eql(1);
      expect(res.errors[0].message).to.eql(
        'source is not an array');
      done();
    });
  });

  it("should validate on source as array type", function(done) {
    var descriptor = {type: 'array'}
      , validator = new schema(descriptor)
      , source = [];

    validator.validate(source, function(err, res) {
      expect(err).to.eql(null);
      expect(res).to.eql(null);
      done();
    });
  });

  it("should error on source as boolean type", function(done) {
    var descriptor = {type: 'boolean'}
      , validator = new schema(descriptor)
      , source = {};

    validator.validate(source, function(err, res) {
      expect(err).to.eql(null);
      expect(res.errors.length).to.eql(1);
      expect(res.errors[0].message).to.eql(
        'source is not a boolean');
      done();
    });
  });

  it("should validate on source as boolean type", function(done) {
    var descriptor = {type: 'boolean'}
      , validator = new schema(descriptor)
      , source = true;

    validator.validate(source, function(err, res) {
      expect(err).to.eql(null);
      expect(res).to.eql(null);
      done();
    });
  });

  it("should error on source as date type", function(done) {
    var descriptor = {type: 'date', format: 'YYYY-MM-DD'}
      , validator = new schema(descriptor)
      , source = '2013-06-50';

    validator.validate(source, function(err, res) {
      expect(err).to.eql(null);
      expect(res.errors.length).to.eql(1);
      expect(res.errors[0].message).to.eql(
        'source date 2013-06-50 is invalid for format YYYY-MM-DD');
      done();
    });
  });

  it("should validate on source as date type", function(done) {
    var descriptor = {type: 'date'}
      , validator = new schema(descriptor)
      , source = true;

    validator.validate(source, function(err, res) {
      expect(err).to.eql(null);
      expect(res).to.eql(null);
      done();
    });
  });


  it("should error on source as enum type", function(done) {
    var descriptor = {type: 'enum', list: ['foo', 'bar']}
      , validator = new schema(descriptor)
      , source = 'qux';

    validator.validate(source, function(err, res) {
      expect(err).to.eql(null);
      expect(res.errors.length).to.eql(1);
      expect(res.errors[0].message).to.eql(
        'source must be one of foo, bar');
      done();
    });
  });

  it("should validate on source as enum type", function(done) {
    var descriptor = {type: 'enum', list: ['foo', 'bar']}
      , validator = new schema(descriptor)
      , source = 'foo';

    validator.validate(source, function(err, res) {
      expect(err).to.eql(null);
      expect(res).to.eql(null);
      done();
    });
  });

  it("should error on source as float type", function(done) {
    var descriptor = {type: 'float'}
      , validator = new schema(descriptor)
      , source = 'foo';

    validator.validate(source, function(err, res) {
      expect(err).to.eql(null);
      expect(res.errors.length).to.eql(1);
      expect(res.errors[0].message).to.eql(
        'source is not a float');
      done();
    });
  });

  it("should validate on source as float type", function(done) {
    var descriptor = {type: 'float'}
      , validator = new schema(descriptor)
      , source = 1.667;

    validator.validate(source, function(err, res) {
      expect(err).to.eql(null);
      expect(res).to.eql(null);
      done();
    });
  });

  it("should error on source as integer type", function(done) {
    var descriptor = {type: 'integer'}
      , validator = new schema(descriptor)
      , source = 'foo';

    validator.validate(source, function(err, res) {
      expect(err).to.eql(null);
      expect(res.errors.length).to.eql(1);
      expect(res.errors[0].message).to.eql(
        'source is not an integer');
      done();
    });
  });

  it("should validate on source as integer type", function(done) {
    var descriptor = {type: 'integer'}
      , validator = new schema(descriptor)
      , source = 1024;

    validator.validate(source, function(err, res) {
      expect(err).to.eql(null);
      expect(res).to.eql(null);
      done();
    });
  });

  it("should error on source as method type", function(done) {
    var descriptor = {type: 'method'}
      , validator = new schema(descriptor)
      , source = 'foo';

    validator.validate(source, function(err, res) {
      expect(err).to.eql(null);
      expect(res.errors.length).to.eql(1);
      expect(res.errors[0].message).to.eql(
        'source is not a method');
      done();
    });
  });

  it("should validate on source as method type", function(done) {
    var descriptor = {type: 'method'}
      , validator = new schema(descriptor)
      , source = function noop(){};

    validator.validate(source, function(err, res) {
      expect(err).to.eql(null);
      expect(res).to.eql(null);
      done();
    });
  });

  it("should error on source as null type", function(done) {
    var descriptor = {type: 'null'}
      , validator = new schema(descriptor)
      , source = 'foo';

    validator.validate(source, function(err, res) {
      expect(err).to.eql(null);
      expect(res.errors.length).to.eql(1);
      expect(res.errors[0].message).to.eql(
        'source is not null');
      done();
    });
  });

  it("should validate on source as null type", function(done) {
    var descriptor = {type: 'null'}
      , validator = new schema(descriptor)
      , source = null;

    validator.validate(source, function(err, res) {
      expect(err).to.eql(null);
      expect(res).to.eql(null);
      done();
    });
  });

  it("should error on source as number type", function(done) {
    var descriptor = {type: 'number'}
      , validator = new schema(descriptor)
      , source = 'foo';

    validator.validate(source, function(err, res) {
      expect(err).to.eql(null);
      expect(res.errors.length).to.eql(1);
      expect(res.errors[0].message).to.eql(
        'source is not a number');
      done();
    });
  });

  it("should validate on source as number type", function(done) {
    var descriptor = {type: 'number'}
      , validator = new schema(descriptor)
      , source = 3;

    validator.validate(source, function(err, res) {
      expect(err).to.eql(null);
      expect(res).to.eql(null);
      done();
    });
  });

  it("should error on source as object type", function(done) {
    var descriptor = {type: 'object'}
      , validator = new schema(descriptor)
      , source = 'foo';

    validator.validate(source, function(err, res) {
      expect(err).to.eql(null);
      expect(res.errors.length).to.eql(1);
      expect(res.errors[0].message).to.eql(
        'source is not an object');
      done();
    });
  });

  it("should validate on source as object type", function(done) {
    var descriptor = {type: 'object'}
      , validator = new schema(descriptor)
      , source = {};

    validator.validate(source, function(err, res) {
      expect(err).to.eql(null);
      expect(res).to.eql(null);
      done();
    });
  });

  it("should error on source as pattern type", function(done) {
    var descriptor = {type: 'string', pattern: /^foo$/}
      , validator = new schema(descriptor)
      , source = 'bar';

    validator.validate(source, function(err, res) {
      expect(err).to.eql(null);
      expect(res.errors.length).to.eql(1);
      expect(res.errors[0].message).to.eql(
        'source value bar does not match pattern /^foo$/');
      done();
    });
  });

  it("should validate on source as pattern type", function(done) {
    var descriptor = {type: 'string', pattern: /^foo$/}
      , validator = new schema(descriptor)
      , source = 'foo';

    validator.validate(source, function(err, res) {
      expect(err).to.eql(null);
      expect(res).to.eql(null);
      done();
    });
  });

  it("should error on source as regexp type", function(done) {
    var descriptor = {type: 'regexp'}
      , validator = new schema(descriptor)
      , source = '+';

    validator.validate(source, function(err, res) {
      expect(err).to.eql(null);
      expect(res.errors.length).to.eql(1);
      expect(res.errors[0].message).to.eql(
        'source is not a valid regexp');
      done();
    });
  });

  it("should validate on source as regexp type", function(done) {
    var descriptor = {type: 'regexp'}
      , validator = new schema(descriptor)
      , source = /^foo$/;

    validator.validate(source, function(err, res) {
      expect(err).to.eql(null);
      expect(res).to.eql(null);
      done();
    });
  });


  it("should error on source as string type", function(done) {
    var descriptor = {type: 'string'}
      , validator = new schema(descriptor)
      , source = {};

    validator.validate(source, function(err, res) {
      expect(err).to.eql(null);
      expect(res.errors.length).to.eql(1);
      expect(res.errors[0].message).to.eql(
        'source is not a string');
      done();
    });
  });

  it("should validate on source as string type", function(done) {
    var descriptor = {type: 'string'}
      , validator = new schema(descriptor)
      , source = 'foo';

    validator.validate(source, function(err, res) {
      expect(err).to.eql(null);
      expect(res).to.eql(null);
      done();
    });
  });

});
