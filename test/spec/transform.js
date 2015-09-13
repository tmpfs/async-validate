var expect = require('chai').expect
  , Schema = require('../../index');

describe('async-validate:', function() {

  var descriptor = {
    name: {
      type: 'string',
      required: true, pattern: /^[a-z]+$/,
      transform: function(value) {
        return value.trim();
      }
    }
  }

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
