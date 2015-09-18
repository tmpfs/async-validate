var expect = require('chai').expect
  , Schema = require('../../index')
  , email = /^.+@.+\..+/;

describe('async-validate:', function() {

  it('should error on multiple validation rules for a field',
    function(done) {
      var descriptor = {
        email: [
          {type: 'string', required: true},
          {type: 'string', pattern: email}
        ]
      }
      var schema = new Schema(descriptor);
      schema.validate({address: 'joe@example'}, function(err, res) {
        expect(res.errors.length).to.eql(2);
        expect(res.errors[0].message).to.eql('email is required');
        expect(res.errors[1].message).to.eql(
          'email value undefined does not match pattern ' + email);
        done();
      });
    }
  );
  it('should error on multiple validation rules for a field single failure',
    function(done) {
      var descriptor = {
        email: [
          {type: 'string', required: true},
          {type: 'string', pattern: email}
        ]
      }
      var schema = new Schema(descriptor);
      schema.validate({email: 'user@example'}, function(err, res) {
        expect(res.errors.length).to.eql(1);
        expect(res.errors[0].message).to.eql(
          'email value user@example does not match pattern ' + email);
        done();
      });
    }
  );

  it('should error on multiple validation rules with a validation function',
    function(done) {
      var descriptor = {
        email: [
          {type: 'string', pattern: email, required: true},
          function(cb) {
            var email = 'user@example.com';
            if(this.value === email) {
              this.raise('Email address %s already exists', email);
            }
            cb();
          }
        ]
      }
      var schema = new Schema(descriptor)
        , source = {email: 'user@example.com'};

      schema.validate(source, function(err, res) {
        expect(res.errors.length).to.eql(1);
        expect(res.errors[0].message).to.eql(
          'Email address user@example.com already exists');
        done();
      });
    }
  );

});
