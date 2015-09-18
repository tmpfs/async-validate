var expect = require('chai').expect
  , Schema = require('../../index')
  , descriptor = require('../fixtures/schema/date')
  , noformat = require('../fixtures/schema/date-no-format')
  , pattern = require('../fixtures/schema/date-pattern')
  , range = require('../fixtures/schema/date-range');

describe('async-validate:', function() {

  it('should error on invalid date value using a format', function(done) {
    var schema = new Schema(descriptor);
    schema.validate({active: '2013-06-50'}, function(err, res) {
      expect(res.errors.length).to.eql(1);
      expect(res.errors[0].message).to.eql(
        'active date 2013-06-50 is invalid for format YYYY-MM-DD');
      done();
    });
  });

  it('should error on invalid date value no format (ISO 8601)',
    function(done) {
      var schema = new Schema(noformat);
      schema.validate({active: '2011-10-10T10:20:90'}, function(err, res) {
        expect(res.errors.length).to.eql(1);
        expect(res.errors[0].message).to.eql(
          'active date 2011-10-10T10:20:90 is invalid');
        done();
      });
    }
  );

  it('should error on invalid date value no format (bad input)',
    function(done) {
      var schema = new Schema(noformat);
      schema.validate({active: 'not a date'}, function(err, res) {
        expect(res.errors.length).to.eql(1);
        expect(res.errors[0].message).to.eql(
          'active date not a date is invalid');
        done();
      });
    }
  );

  it('should error on invalid date value using a format and pattern',
    function(done) {
      var schema = new Schema(pattern);
      schema.validate({active: '13-06-24'}, function(err, res) {
        expect(res.errors.length).to.eql(1);
        expect(res.errors[0].message).to.eql(
          'active value 13-06-24 does not match pattern '
          + pattern.fields.active.pattern);
        done();
      });
    }
  );

  it('should validate date value using a format', function(done) {
    var schema = new Schema(descriptor);
    schema.validate({active: '2013-06-24'}, function(err, res) {
      expect(err).to.eql(null);
      expect(res).to.eql(null);
      done();
    });
  });

  it('should validate date value using a format and local', function(done) {
    var descriptor = {
      type: 'object',
      fields: {
        active: {type: 'date', format: 'YYYY-MM-DD', local: true}
      }
    }
    var schema = new Schema(descriptor);
    schema.validate({active: '2013-06-24'}, function(err, res) {
      expect(err).to.eql(null);
      expect(res).to.eql(null);
      done();
    });
  });

  it('should validate date value no format (ISO 8601)', function(done) {
    var schema = new Schema(descriptor);
    schema.validate({active: '2011-10-10T10:20:30'}, function(err, res) {
      expect(err).to.eql(null);
      expect(res).to.eql(null);
      done();
    });
  });

  it('should validate optional date range reference', function(done) {
    var schema = new Schema(range);
    schema.validate({start: '', end: '2013-06-24'}, function(err, res) {
      expect(err).to.eql(null);
      expect(res).to.eql(null);
      done();
    });
  });

});
