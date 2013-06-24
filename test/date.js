var util = require('util');
var assert = require('chai').assert;
var schema = require('../index');

suite("Date validator:", function() {
  test("invalid date value using a format", function() {
    var descriptor = {
      active: {type: "date", format: "YYYY-MM-DD"}
    }
    var validator = new schema(descriptor);
    validator.validate({active: "2013-06-50"}, function(errors, fields) {
      assert.equal(errors.length, 1);
      assert.equal(errors[0].message,
        "active date 2013-06-50 is invalid for format YYYY-MM-DD");
    });
  });
  test("invalid date value no format (ISO 8601)", function() {
    var descriptor = {
      active: {type: "date"}
    }
    var validator = new schema(descriptor);
    validator.validate({active: "2011-10-10T10:20:90"}, function(errors, fields) {
      assert.equal(errors.length, 1);
      assert.equal(errors[0].message,
        "active date 2011-10-10T10:20:90 is invalid");
    });
  });
  test("invalid date value no format (bad input)", function() {
    var descriptor = {
      active: {type: "date"}
    }
    var validator = new schema(descriptor);
    validator.validate({active: "not a date"}, function(errors, fields) {
      assert.equal(errors.length, 1);
      assert.equal(errors[0].message,
        "active date not a date is invalid");
    });
  });
  var ptn = /^([\d]{4})-([\d]{2})-([\d]{2})$/;
  test("invalid date value using a format and pattern", function() {
    var descriptor = {
      active: {
        type: "date",
        format: "YYYY-MM-DD",
        pattern: ptn
      }
    }
    var validator = new schema(descriptor);
    validator.validate({active: "13-06-24"}, function(errors, fields) {
      assert.equal(errors.length, 1);
      //console.log(errors[0].message);
      assert.equal(errors[0].message,
        "active value 13-06-24 does not match pattern " + ptn);
    });
  });

  test("valid date value using a format", function() {
    var descriptor = {
      active: {type: "date", format: "YYYY-MM-DD"}
    }
    var validator = new schema(descriptor);
    validator.validate({active: "2013-06-24"}, function(errors, fields) {
      assert.isNull(errors);
      assert.isNull(fields);
    });
  });
  test("valid date value no format (ISO 8601)", function() {
    var descriptor = {
      active: {type: "date"}
    }
    var validator = new schema(descriptor);
    validator.validate({active: "2011-10-10T10:20:30"}, function(errors, fields) {
      assert.isNull(errors);
      assert.isNull(fields);
    });
  });
});
