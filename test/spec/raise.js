var expect = require('chai').expect
  , Schema = require('../../index');

describe('async-validate:', function() {

  it('should use raise() helper method', function(done) {
    var descriptor = {
      type: 'object',
      fields: {
        name: function(cb) {
          this.raise('%s is a required field', this.field);
          cb();
        }
      }
    }
    var schema = new Schema(descriptor);
    schema.validate({}, function(err, res) {
      expect(res.errors.length).to.eql(1);
      expect(res.errors[0].message).to.eql('name is a required field');
      done();
    });
  });

});
