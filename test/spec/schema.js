var expect = require('chai').expect
  , schema = require('../../index');

describe("async-validate:", function() {

  it("should error with no rules", function(done) {
    function fn() {
      var validator = new schema(); 
    }
    expect(fn).throws(Error);
    expect(fn).throws(/cannot configure/i);
    expect(fn).throws(/with no rules/i);
    done();
  });

  it("should error with rules as array", function(done) {
    function fn() {
      var validator = new schema([]); 
    }
    expect(fn).throws(Error);
    expect(fn).throws(/rules must be an object/i);
    done();
  });

  it("should error on validate with no rules", function(done) {
    var validator = new schema({}); 
    function fn() {
      validator.validate({});
    }
    expect(fn).throws(Error);
    expect(fn).throws(/cannot validate with no rules/i);
    done();
  });

  it("should error on validate with no source", function(done) {
    var validator = new schema({name: function(cb){cb(this.errors)}}); 
    function fn() {
      validator.validate();
    }
    expect(fn).throws(Error);
    expect(fn).throws(/cannot validate with no source/i);
    done();
  });

  it("should error on validate with no callback", function(done) {
    var validator = new schema({name: function(cb){cb(this.errors)}}); 
    function fn() {
      validator.validate({});
    }
    expect(fn).throws(Error);
    expect(fn).throws(/cannot validate with no callback/i);
    done();
  });


  it("should error on validate with unknown type", function(done) {
    var validator = new schema({name: {type: 'unknown-type'}}); 
    function fn() {
      validator.validate({}, function noop(){});
    }
    expect(fn).throws(Error);
    expect(fn).throws(/unknown rule type/i);
    done();
  });


});
