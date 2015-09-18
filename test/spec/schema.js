var expect = require('chai').expect
  , Schema = require('../../index');

describe("async-validate:", function() {

  var descriptor = {
    type: 'object',
    fields: {
      name: {
        type: 'string'
      }
    }
  }

  var unknown = {
    type: 'object',
    fields: {
      name: {
        type: 'unknown-type'
      }
    }
  }

  it("should define with fields", function(done) {
    var schema = new Schema(descriptor); 
    expect(schema.rules).to.be.an('object');
    expect(schema.rules.fields).to.be.an('object');
    done();
  });

  it("should error with no rules", function(done) {
    function fn() {
      new Schema(); 
    }
    expect(fn).throws(Error);
    expect(fn).throws(/cannot configure/i);
    expect(fn).throws(/with no rules/i);
    done();
  });

  it("should error with rules as null", function(done) {
    function fn() {
      new Schema(null); 
    }
    expect(fn).throws(Error);
    expect(fn).throws(/rules must be an object/i);
    done();
  });

  it("should error on validate with no source", function(done) {
    var schema = new Schema(descriptor); 
    function fn() {
      schema.validate();
    }
    expect(fn).throws(Error);
    expect(fn).throws(/cannot validate with no source/i);
    done();
  });

  it("should error on validate with no callback", function(done) {
    var schema = new Schema(descriptor); 
    function fn() {
      schema.validate({});
    }
    expect(fn).throws(Error);
    expect(fn).throws(/cannot validate with no callback/i);
    done();
  });

  it("should error on validate with unknown type", function(done) {
    var schema = new Schema(unknown); 

    function fn() {
      schema.validate({}, function noop(){});
    }
    expect(fn).throws(Error);
    expect(fn).throws(/unknown rule type/i);
    done();
  });

  it("should error with no rule type", function(done) {
    function fn() {
      var schema = new Schema({}); 
      schema.validate({}, function noop(){});
    }
    expect(fn).throws(Error);
    expect(fn).throws(/type property must be string or function/i);
    done();
  });

  it("should error with no rule type (multiple types)", function(done) {
    var descriptor = {type: [{}]};
    function fn() {
      var schema = new Schema(descriptor); 
      schema.validate({}, function noop(){});
    }
    expect(fn).throws(Error);
    expect(fn).throws(/type property must be string or function/i);
    done();
  });

});
