var expect = require('chai').expect
  , schema = require('../../index')
  , msg = require('../../messages')
  , descriptor = require('../fixtures/schema/message-string')
  , func = require('../fixtures/schema/message-function')
  , funcerror = require('../fixtures/schema/message-function-error')
  , override = require('../fixtures/schema/message-string-override')

describe('async-validate:', function() {

  // clone of the default messages
  var clone = schema.clone(msg);

  // change a message
  clone.required = '%s is a required field';

  it('should validate using a custom error message', function(done) {
    var validator = new schema(descriptor);
    validator.validate({}, function(err, res) {
      expect(res.errors.length).to.eql(1);
      expect(res.errors[0].message).to.eql('Name is required');
      done();
    });
  });

  it('should validate using a custom error message function', function(done) {
    var validator = new schema(func);
    validator.validate({}, function(err, res) {
      expect(res.errors.length).to.eql(1);
      expect(res.errors[0].message).to.eql('Name is required');
      done();
    });
  });

  it('should validate using an message function (returns Error)',
    function(done) {
      var validator = new schema(funcerror);
      validator.validate({}, function(err, res) {
        expect(res.errors.length).to.eql(1);
        expect(res.errors[0].message).to.eql('Name is required');
        done();
      });
    }
  );

  it('should validate using custom messages', function(done) {
    var validator = new schema(override);

    // assign updated messages to the schema
    validator.messages(clone);

    validator.validate({}, function(err, res) {
      expect(res.errors.length).to.eql(1);
      expect(res.errors[0].message).to.eql('name is a required field');
      done();
    });
  });

});
