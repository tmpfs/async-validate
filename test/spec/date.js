var util = require('util');
var assert = require('chai').assert;
var schema = require('../../index');

describe("async-validate:", function(done) {
  it("should error on invalid date value using a format", function(done) {
    var descriptor = {
      active: {type: "date", format: "YYYY-MM-DD"}
    }
    var validator = new schema(descriptor);
    validator.validate({active: "2013-06-50"}, function(errors, fields) {
      assert.equal(errors.length, 1);
      assert.equal(errors[0].message,
        "active date 2013-06-50 is invalid for format YYYY-MM-DD");
      done();
    });
  });
  it("should error on invalid date value no format (ISO 8601)", function(done) {
    var descriptor = {
      active: {type: "date"}
    }
    var validator = new schema(descriptor);
    validator.validate({active: "2011-10-10T10:20:90"}, function(errors, fields) {
      assert.equal(errors.length, 1);
      assert.equal(errors[0].message,
        "active date 2011-10-10T10:20:90 is invalid");
      done();
    });
  });
  it("should error on invalid date value no format (bad input)", function(done) {
    var descriptor = {
      active: {type: "date"}
    }
    var validator = new schema(descriptor);
    validator.validate({active: "not a date"}, function(errors, fields) {
      assert.equal(errors.length, 1);
      assert.equal(errors[0].message,
        "active date not a date is invalid");
      done();
    });
  });
  var ptn = /^([\d]{4})-([\d]{2})-([\d]{2})$/;
  it("should error on invalid date value using a format and pattern", function(done) {
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
      assert.equal(errors[0].message,
        "active value 13-06-24 does not match pattern " + ptn);
      done();
    });
  });

  it("should validate date value using a format", function(done) {
    var descriptor = {
      active: {type: "date", format: "YYYY-MM-DD"}
    }
    var validator = new schema(descriptor);
    validator.validate({active: "2013-06-24"}, function(errors, fields) {
      assert.isNull(errors);
      assert.isNull(fields);
      done();
    });
  });

  it("should validate date value using a format and local", function(done) {
    var descriptor = {
      active: {type: "date", format: "YYYY-MM-DD", local: true}
    }
    var validator = new schema(descriptor);
    validator.validate({active: "2013-06-24"}, function(errors, fields) {
      assert.isNull(errors);
      assert.isNull(fields);
      done();
    });
  });

  it("should validate date value no format (ISO 8601)", function(done) {
    var descriptor = {
      active: {type: "date"}
    }
    var validator = new schema(descriptor);
    validator.validate({active: "2011-10-10T10:20:30"}, function(errors, fields) {
      assert.isNull(errors);
      assert.isNull(fields);
      done();
    });
  });
  var date = {
    type: "date",
    pattern: /^([\d]{4})-([\d]{2})-([\d]{2})$/,
    format: "YYYY-MM-DD"
  }
  it("should validate optional date range reference", function(done) {
    var descriptor = {
      start: date,
      end: date
    }
    var validator = new schema(descriptor);
    validator.validate({start: "", end: "2013-06-24"}, function(errors, fields) {
      assert.isNull(errors);
      assert.isNull(fields);
      done();
    });
  });
});
