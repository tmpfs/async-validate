var expect = require('chai').expect
  , Schema = require('../../index');

describe('async-validate:', function() {

  it('should return simple object on clone', function(done) {
    var value = 'mock';
    expect(Schema.clone(value)).to.eql(value);
    done();
  });

  it('should clone array', function(done) {
    var value = [1,2,['foo']];
    expect(Schema.clone(value)).to.eql([1,2,['foo']]);
    done();
  });

});
