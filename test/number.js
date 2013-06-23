var util = require('util');
var assert = require('chai').assert;
var schema = require('../index');

suite("Number validation:", function() {
  test("validate a value is a number", function() {
    var descriptor = {
      port: {type: "number"},
    }
    var validator = new schema(descriptor);
    validator.validate({port: "80"}, function(errors, fields) {
      assert.equal(errors.length, 1);
      assert.equal(errors[0].message, "port is not a number");
    });
  });
  test("validate a number is greater than a minimum value", function() {
    var descriptor = {
      port: {type: "number", min: 8080},
    }
    var validator = new schema(descriptor);
    validator.validate({port: 80}, function(errors, fields) {
      assert.equal(errors.length, 1);
      assert.equal(errors[0].message, "port cannot be less than 8080");
    });
  });
  test("validate a number is greater than a minimum value", function() {
    var descriptor = {
      port: {type: "number", max: 80},
    }
    var validator = new schema(descriptor);
    validator.validate({port: 8080}, function(errors, fields) {
      assert.equal(errors.length, 1);
      assert.equal(errors[0].message, "port cannot be greater than 80");
    });
  });
  test("validate a number is greater than a minimum value", function() {
    var descriptor = {
      port: {type: "number", min: 80, max: 1024},
    }
    var validator = new schema(descriptor);
    validator.validate({port: 8080}, function(errors, fields) {
      assert.equal(errors.length, 1);
      assert.equal(errors[0].message, "port must be between 80 and 1024");
    });
  });
  test("validate a number is an integer", function() {
    var descriptor = {
      port: {type: "integer"},
    }
    var validator = new schema(descriptor);
    validator.validate({port: 1.618}, function(errors, fields) {
      assert.equal(errors.length, 1);
      //console.log(errors[0].message);
      assert.equal(errors[0].message, "port is not an integer");
    });
  });
  test("validate a number is a float", function() {
    var descriptor = {
      ratio: {type: "float"},
    }
    var validator = new schema(descriptor);
    validator.validate({ratio: 1618}, function(errors, fields) {
      assert.equal(errors.length, 1);
      //console.log(errors[0].message);
      //assert.equal(errors[0].message, "port is not an integer");
    });
  });
});
