var expect = require('chai').expect
  , Schema = require('../../index')
  , msg = require('../../messages')
  , literal = require('../fixtures/schema/message-literal');

describe('async-validate:', function() {

  it('should validate using literal option', function(done) {
    var schema = new Schema(literal);

    // clone of the default messages
    var clone = Schema.clone(msg);

    // change a message
    clone.required = 'REQUIRED !';

    // assign updated messages to the Schema
    schema.messages(clone);

    schema.validate({}, {literal: true}, function(err, res) {
      expect(res.errors.length).to.eql(2);
      expect(res.errors[0].message).to.eql('REQUIRED !');
      expect(res.errors[1].message).to.eql('REQUIRED ! job');
      done();
    });
  });

});
