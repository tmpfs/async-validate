var expect = require('chai').expect
  , Schema = require('../../index');

describe("async-validate:", function() {

  it("should define with fields", function(done) {
    var schema = new Schema({fields: {name: {type: 'string'}}}); 
    expect(schema.rules).to.be.an('object');
    expect(schema.rules.fields).to.be.an('object');
    done();
  });

  //it("should define without fields", function(done) {
    //var schema = new Schema({name: {type: 'string'}}); 
    //expect(schema.rules).to.be.an('object');
    //expect(schema.rules.fields).to.be.an('object');
    //done();
  //});

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
    var schema = new Schema({name: function(cb){cb()}}); 
    function fn() {
      schema.validate();
    }
    expect(fn).throws(Error);
    expect(fn).throws(/cannot validate with no source/i);
    done();
  });

  it("should error on validate with no callback", function(done) {
    var schema = new Schema({name: function(cb){cb()}}); 
    function fn() {
      schema.validate({});
    }
    expect(fn).throws(Error);
    expect(fn).throws(/cannot validate with no callback/i);
    done();
  });

  it("should error on validate with unknown type", function(done) {
    var descriptor = {
          fields: {
            name: {
              type: 'unknown-type'
            }
          }
        }
      , schema = new Schema(descriptor); 

    function fn() {
      schema.validate({}, function noop(){});
    }
    expect(fn).throws(Error);
    expect(fn).throws(/unknown rule type/i);
    done();
  });

});
