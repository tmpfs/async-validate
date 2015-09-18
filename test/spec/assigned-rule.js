var Schema = require('../../index')
  , descriptor = require('../fixtures/schema/assigned-rule');

describe('async-validate:', function() {

  it('should access rule property from test function', function(done) {
    var schema = new Schema(descriptor);
    schema.validate({id: 'mock'}, function() {
      done();
    });
  });

});
