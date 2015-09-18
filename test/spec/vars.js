var expect = require('chai').expect
  , Schema = require('../../index')
  , Model = require('../fixtures/model')
  , descriptor = require('../fixtures/schema/vars');

describe('async-validate:', function() {

  before(function(done) {
    // load plugin definition
    Schema.plugin([require('../fixtures/vars-plugin')]);
    done();
  });

  it('should error with vars option and missing id', function(done) {
    var schema = new Schema(descriptor)
      , opts = {vars: {model: new Model()}}
      , source = {id: 'qux'};
    schema.validate(source, opts, function(err, res) {
      expect(res.errors.length).to.eql(1);
      expect(res.errors[0].message).to.eql(
        'user not found for id qux');
      done();
    });
  });

  it('should validate with vars option', function(done) {
    var schema = new Schema(descriptor)
      , opts = {vars: {model: new Model()}}
      , source = {id: 'foo'};
    schema.validate(source, opts, function(err, res) {
      expect(err).to.eql(null);
      expect(res).to.eql(null);
      done();
    });
  });
});
