var expect = require('chai').expect
  , Schema = require('../../index');

describe('async-validate:', function() {

  it('should error on required string field', function(done) {
    var descriptor = {
      type: 'object',
      fields: {
        name: {type: 'string', required: true}
      }
    }
    var schema = new Schema(descriptor);
    schema.validate({noname: 'field'}, function(err, res) {
      expect(res.errors.length).to.eql(1);
      expect(res.fields.name.length).to.eql(1);
      expect(res.errors[0].message).to.eql('name is required');
      done();
    });
  });

  it('should error on non-string type', function(done) {
    var descriptor = {
      type: 'object',
      fields: {
        name: {type: 'string'}
      }
    }
    var schema = new Schema(descriptor);
    schema.validate({name: 10}, function(err, res) {
      expect(res.errors.length).to.eql(1);
      expect(res.errors[0].message).to.eql('name is not a string');
      done();
    });
  });

  it('should error on required string field with minimum length',
    function(done) {
      var descriptor = {
        type: 'object',
        fields: {
          name: {type: 'string', required: true, min: 8}
        }
      }
      var schema = new Schema(descriptor);
      schema.validate({name: 'field'}, function(err, res) {
        expect(res.errors.length).to.eql(1);
        expect(res.errors[0].message).to.eql(
          'name must be at least 8 characters');
        done();
      });
    }
  );

  it('should error on required string field with maximum length',
    function(done) {
      var descriptor = {
        type: 'object',
        fields: {
          name: {type: 'string', required: true, max: 2}
        }
      }
      var schema = new Schema(descriptor);
      schema.validate({name: 'field'}, function(err, res) {
        expect(res.errors.length).to.eql(1);
        expect(res.errors[0].message).to.eql(
          'name cannot be longer than 2 characters');
        done();
      });
    }
  );

  it('should error on required string field is less than a length range',
    function(done) {
      var descriptor = {
        type: 'object',
        fields: {
          name: {type: 'string', required: true, min: 6, max: 8}
        }
      }
      var schema = new Schema(descriptor);
      schema.validate({name: 'field'}, function(err, res) {
        expect(res.errors.length).to.eql(1);
        expect(res.errors[0].message).to.eql(
          'name must be between 6 and 8 characters');
        done();
      });
    }
  );

  it('should error on required string field is greater than a length range',
    function(done) {
      var descriptor = {
        type: 'object',
        fields: {
          name: {type: 'string', required: true, min: 2, max: 4}
        }
      }
      var schema = new Schema(descriptor);
      schema.validate({name: 'field'}, function(err, res) {
        expect(res.errors.length).to.eql(1);
        expect(res.errors[0].message).to.eql(
          'name must be between 2 and 4 characters');
        done();
      });
    }
  );
  it('should error on regular expression pattern mismatch',
    function(done) {
      var descriptor = {
        type: 'object',
        fields: {
          name: {type: 'string', pattern: /^[0-9]+$/}
        }
      }
      var schema = new Schema(descriptor);
      schema.validate({name: 'alpha'}, function(err, res) {
        expect(res.errors.length).to.eql(1);
        expect(res.errors[0].message).to.eql(
          'name value alpha does not match pattern /^[0-9]+$/');
        done();
      });
    }
  );

  it('should error on string consisting of whitespace',
    function(done) {
      var descriptor = {
        type: 'object',
        fields: {
          name: {type: 'string', whitespace: true}
        }
      }
      var schema = new Schema(descriptor);
      schema.validate({name: '   '}, function(err, res) {
        expect(res.errors.length).to.eql(1);
        expect(res.errors[0].message).to.eql('name cannot be empty');
        done();
      });
    }
  );

  it('should error on empty string',
    function(done) {
      var descriptor = {
        type: 'object',
        fields: {
          name: {type: 'string', required: true, whitespace: true}
        }
      }
      var schema = new Schema(descriptor);
      schema.validate({name: ''}, function(err, res) {
        expect(res.errors.length).to.eql(1);
        expect(res.errors[0].message).to.eql('name cannot be empty');
        done();
      });
    }
  );

  it('should validate on required string field', function(done) {
    var descriptor = {
      type: 'object',
      fields: {
        name: {type: 'string', required: true, whitespace: true}
      }
    }
    var schema = new Schema(descriptor);
    schema.validate({name: 'field'}, function(err, res) {
      expect(err).to.eql(null);
      expect(res).to.eql(null);
      done();
    });
  });


  it('should validate on required string field in range',
    function(done) {
      var descriptor = {
        type: 'object',
        fields: {
          name: {type: 'string', required: true, min: 6, max: 20}
        }
      }
      var schema = new Schema(descriptor);
      schema.validate({name: 'valid field'}, function(err, res) {
        expect(err).to.eql(null);
        expect(res).to.eql(null);
        done();
      });
    }
  );

});
