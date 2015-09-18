var expect = require('chai').expect
  , Schema = require('../../index')
  , descriptor = require('../fixtures/schema/transform');

describe('async-validate:', function() {

  it('should transform by stripping whitespace', function(done) {
    var schema = new Schema(descriptor)
      , source = {name: ' user  '};

    schema.validate(source, function(err, res) {
      expect(err).to.eql(null);
      expect(res).to.eql(null);
      expect(source.name).to.eql('user');
      done();
    });
  });

});
