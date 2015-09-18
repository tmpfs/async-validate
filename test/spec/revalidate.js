var expect = require('chai').expect
  , Schema = require('../../index');

describe('async-validate:', function() {

  var descriptor = {
    type: 'object',
    fields: {
      name: {type: 'string', required: true}
    }
  }

  it('should validate after failure',
    function(done) {
      var schema = new Schema(descriptor);
      schema.validate({}, function(err, res) {
        expect(res.errors.length).to.eql(1);
        expect(res.errors[0].message).to.eql('name is required');
        schema.validate({name: 'user'}, function(err, res) {
          expect(err).to.eql(null);
          expect(res).to.eql(null);
          done();
        });
      });
    }
  );

});
