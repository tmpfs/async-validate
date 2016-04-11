var expect = require('chai').expect
  , Schema = require('../../index')
  , msg = require('../../messages')
  , descriptor = require('../fixtures/schema/message-string')
  , func = require('../fixtures/schema/message-function')
  , funcerror = require('../fixtures/schema/message-function-error')
  , override = require('../fixtures/schema/message-string-override');

describe('async-validate:', function() {

  // clone of the default messages
  var clone = Schema.clone(msg);

  // change a message
  clone.required = '%s is a required field';

  it('should validate using a custom error message', function(done) {
    var schema = new Schema(descriptor);
    schema.validate({}, function(err, res) {
      expect(res.errors.length).to.eql(1);
      expect(res.errors[0].message).to.eql('Name is required');
      done();
    });
  });

  it('should validate using a custom error message function', function(done) {
    var schema = new Schema(func);
    schema.validate({}, function(err, res) {
      expect(res.errors.length).to.eql(1);
      expect(res.errors[0].message).to.eql('Name is required');
      done();
    });
  });

  it('should validate using an message function (returns Error)',
    function(done) {
      var schema = new Schema(funcerror);
      schema.validate({}, function(err, res) {
        expect(res.errors.length).to.eql(1);
        expect(res.errors[0].message).to.eql('Name is required');
        done();
      });
    }
  );

  it('should validate using custom messages', function(done) {
    var schema = new Schema(override);

    // assign updated messages to the Schema
    schema.messages(clone);

    schema.validate({}, function(err, res) {
      expect(res.errors.length).to.eql(1);
      expect(res.errors[0].message).to.eql('name is a required field');
      done();
    });
  });

  it('should validate using custom messages as option', function(done) {
    // assign updated messages to the Schema
    var schema = new Schema(override, {messages: clone});

    schema.validate({}, function(err, res) {
      expect(res.errors.length).to.eql(1);
      expect(res.errors[0].message).to.eql('name is a required field');
      done();
    });
  });

});
