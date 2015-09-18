var expect = require('chai').expect
  , Schema = require('../../index')
  , arr = {type: 'array'}
  , bool = {type: 'boolean'}
  , float = {type: 'float'}
  , integer = {type: 'integer'}
  , number = {type: 'number'}
  , object = {type: 'object'}
  , date = {type: 'date'}
  , regexp = {type: 'regexp'}
  , nil = {type: 'null'}
  , func = {type: 'function'}
  , string = {type: 'string'}
  , pattern = {type: 'string', pattern: /^foo$/}
  , dateFormat = {type: 'date', format: 'YYYY-MM-DD'}
  , enumerable = {type: 'enum', list: ['foo', 'bar']}

describe("async-validate:", function() {

  it("should error on source as array type", function(done) {
    var schema = new Schema(arr)
      , source = 'foo';

    schema.validate(source, function(err, res) {
      expect(err).to.eql(null);
      expect(res.errors.length).to.eql(1);
      expect(res.errors[0].message).to.eql(
        'source is not an array');
      done();
    });
  });

  it("should validate on source as array type", function(done) {
    var schema = new Schema(arr)
      , source = [];

    schema.validate(source, function(err, res) {
      expect(err).to.eql(null);
      expect(res).to.eql(null);
      done();
    });
  });

  it("should error on source as boolean type", function(done) {
    var schema = new Schema(bool)
      , source = {};

    schema.validate(source, function(err, res) {
      expect(err).to.eql(null);
      expect(res.errors.length).to.eql(1);
      expect(res.errors[0].message).to.eql(
        'source is not a boolean');
      done();
    });
  });

  it("should validate on source as boolean type", function(done) {
    var schema = new Schema(bool)
      , source = true;

    schema.validate(source, function(err, res) {
      expect(err).to.eql(null);
      expect(res).to.eql(null);
      done();
    });
  });

  it("should error on source as date type", function(done) {
    var schema = new Schema(dateFormat)
      , source = '2013-06-50';

    schema.validate(source, function(err, res) {
      expect(err).to.eql(null);
      expect(res.errors.length).to.eql(1);
      expect(res.errors[0].message).to.eql(
        'source date 2013-06-50 is invalid for format YYYY-MM-DD');
      done();
    });
  });

  it("should validate on source as date type", function(done) {
    var schema = new Schema(date)
      , source = true;

    schema.validate(source, function(err, res) {
      expect(err).to.eql(null);
      expect(res).to.eql(null);
      done();
    });
  });


  it("should error on source as enum type", function(done) {
    var schema = new Schema(enumerable)
      , source = 'qux';

    schema.validate(source, function(err, res) {
      expect(err).to.eql(null);
      expect(res.errors.length).to.eql(1);
      expect(res.errors[0].message).to.eql(
        'source must be one of foo, bar');
      done();
    });
  });

  it("should validate on source as enum type", function(done) {
    var schema = new Schema(enumerable)
      , source = 'foo';

    schema.validate(source, function(err, res) {
      expect(err).to.eql(null);
      expect(res).to.eql(null);
      done();
    });
  });

  it("should error on source as float type", function(done) {
    var schema = new Schema(float)
      , source = 'foo';

    schema.validate(source, function(err, res) {
      expect(err).to.eql(null);
      expect(res.errors.length).to.eql(1);
      expect(res.errors[0].message).to.eql(
        'source is not a float');
      done();
    });
  });

  it("should validate on source as float type", function(done) {
    var schema = new Schema(float)
      , source = 1.667;

    schema.validate(source, function(err, res) {
      expect(err).to.eql(null);
      expect(res).to.eql(null);
      done();
    });
  });

  it("should error on source as integer type", function(done) {
    var schema = new Schema(integer)
      , source = 'foo';

    schema.validate(source, function(err, res) {
      expect(err).to.eql(null);
      expect(res.errors.length).to.eql(1);
      expect(res.errors[0].message).to.eql(
        'source is not an integer');
      done();
    });
  });

  it("should validate on source as integer type", function(done) {
    var schema = new Schema(integer)
      , source = 1024;

    schema.validate(source, function(err, res) {
      expect(err).to.eql(null);
      expect(res).to.eql(null);
      done();
    });
  });

  it("should error on source as function type", function(done) {
    var schema = new Schema(func)
      , source = 'foo';

    schema.validate(source, function(err, res) {
      expect(err).to.eql(null);
      expect(res.errors.length).to.eql(1);
      expect(res.errors[0].message).to.eql(
        'source is not a function');
      done();
    });
  });

  it("should validate on source as function type", function(done) {
    var schema = new Schema(func)
      , source = function noop(){};

    schema.validate(source, function(err, res) {
      expect(err).to.eql(null);
      expect(res).to.eql(null);
      done();
    });
  });

  it("should error on source as null type", function(done) {
    var schema = new Schema(nil)
      , source = 'foo';

    schema.validate(source, function(err, res) {
      expect(err).to.eql(null);
      expect(res.errors.length).to.eql(1);
      expect(res.errors[0].message).to.eql(
        'source is not null');
      done();
    });
  });

  it("should validate on source as null type", function(done) {
    var schema = new Schema(nil)
      , source = null;

    schema.validate(source, function(err, res) {
      expect(err).to.eql(null);
      expect(res).to.eql(null);
      done();
    });
  });

  it("should error on source as number type", function(done) {
    var schema = new Schema(number)
      , source = 'foo';

    schema.validate(source, function(err, res) {
      expect(err).to.eql(null);
      expect(res.errors.length).to.eql(1);
      expect(res.errors[0].message).to.eql(
        'source is not a number');
      done();
    });
  });

  it("should validate on source as number type", function(done) {
    var schema = new Schema(number)
      , source = 3;

    schema.validate(source, function(err, res) {
      expect(err).to.eql(null);
      expect(res).to.eql(null);
      done();
    });
  });

  it("should error on source as object type", function(done) {
    var schema = new Schema(object)
      , source = 'foo';

    schema.validate(source, function(err, res) {
      expect(err).to.eql(null);
      expect(res.errors.length).to.eql(1);
      expect(res.errors[0].message).to.eql(
        'source is not an object');
      done();
    });
  });

  it("should validate on source as object type", function(done) {
    var schema = new Schema(object)
      , source = {};

    schema.validate(source, function(err, res) {
      expect(err).to.eql(null);
      expect(res).to.eql(null);
      done();
    });
  });

  it("should error on source as pattern type", function(done) {
    var schema = new Schema(pattern)
      , source = 'bar';

    schema.validate(source, function(err, res) {
      expect(err).to.eql(null);
      expect(res.errors.length).to.eql(1);
      expect(res.errors[0].message).to.eql(
        'source value bar does not match pattern /^foo$/');
      done();
    });
  });

  it("should validate on source as pattern type", function(done) {
    var schema = new Schema(pattern)
      , source = 'foo';

    schema.validate(source, function(err, res) {
      expect(err).to.eql(null);
      expect(res).to.eql(null);
      done();
    });
  });

  it("should error on source as regexp type", function(done) {
    var schema = new Schema(regexp)
      , source = '+';

    schema.validate(source, function(err, res) {
      expect(err).to.eql(null);
      expect(res.errors.length).to.eql(1);
      expect(res.errors[0].message).to.eql(
        'source is not a valid regexp');
      done();
    });
  });

  it("should validate on source as regexp type", function(done) {
    var schema = new Schema(regexp)
      , source = /^foo$/;

    schema.validate(source, function(err, res) {
      expect(err).to.eql(null);
      expect(res).to.eql(null);
      done();
    });
  });

  it("should error on source as string type", function(done) {
    var schema = new Schema(string)
      , source = {};

    schema.validate(source, function(err, res) {
      expect(err).to.eql(null);
      expect(res.errors.length).to.eql(1);
      expect(res.errors[0].message).to.eql(
        'source is not a string');
      done();
    });
  });

  it("should validate on source as string type", function(done) {
    var schema = new Schema(string)
      , source = 'foo';

    schema.validate(source, function(err, res) {
      expect(err).to.eql(null);
      expect(res).to.eql(null);
      done();
    });
  });

});
