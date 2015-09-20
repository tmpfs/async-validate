var expect = require('chai').expect
  , Schema = require('../../index')
  , descriptor = require('../fixtures/schema/error-fields');

describe('async-validate:', function() {

  it('should use unique error field names', function(done) {
    var schema = new Schema(descriptor)
      , source = {address:{}};
    schema.validate(source, function(err, res) {
      //console.dir(res.fields);
      expect(res.fields.name.length).to.eql(1);
      expect(res.fields['address.name'].length).to.eql(1);
      done();
    });
  });

});
