var expect = require('chai').expect
  , Validator = require('../../lib/validator');

describe("async-validate:", function() {

  it("should create class without constructor", function(done) {
    var v = Validator.Type({});
    expect(v instanceof Validator.Type).to.eql(true);
    done();
  });

  it("should use default message", function(done) {
    var v = Validator.Type({field: 'mock', rule: {}});
    expect(v.reason()).to.eql(undefined);
    // trigger default message code path
    v.error();
    done();
  });

});
