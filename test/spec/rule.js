var expect = require('chai').expect
  , Validator = require('../../lib/rule');

describe("async-validate:", function() {

  it("should create class without constructor", function(done) {
    var v = Validator.Type({});
    expect(v instanceof Validator.Type).to.eql(true);
    done();
  });

  it("should use default message", function(done) {
    var v = Validator.Type({field: 'mock', rule: {}, errors: []});
    // trigger default message code path
    v.error();

    // trigger raise with no paramters
    var err = v.raise('mock message');
    expect(err.message).to.eql('mock message');
    done();
  });

  it("should get reason instance", function(done) {
    var v = Validator.Type({});
    expect(v.reason('mock-reason', {foo: 'bar'})).to.be.an('object');
    done();
  });

});
