var expect = require('chai').expect
  , Schema = require('../../index');

describe('async-validate:', function() {

  it('should validate after failure',
    function(done) {
      var descriptor = {
        name: {type: 'string', required: true, whitespace: true}
      }
      var schema = new Schema(descriptor);
      schema.validate({name: ''}, function(err, res) {
        expect(res.errors.length).to.eql(1);
        expect(res.errors[0].message).to.eql('name cannot be empty');
        schema.validate({name: 'user'}, function(err, res) {
          expect(err).to.eql(null);
          expect(res).to.eql(null);
          done();
        });
      });
    }
  );

});
