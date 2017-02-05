var expect = require('chai').expect
  , Schema = require('../../index');

describe("async-validate:", function() {

  var Person = {
    type: 'object',
    fields: {
      name: {
        type: 'string',
        required: true
      }
    }
  };

  var Group = {
    type: 'object',
    fields: {
      name: {
        type: 'string',
        required: true
      },
      brand: {
        type: 'string'
      }
    }
  };

  function resolve() {
    switch(this.type) {
      case 'Person':
        return Person;
      case 'Group':
        return Group;
    }
    throw new Error('Unknown performer type');
  }

  var descriptor = {
    type: 'object',
    fields: {
      performer: {
        type: 'object',
        resolve: resolve
      }
    }
  }

  var mixed = {
    type: 'object',
    fields: {
      performer: {
        type: 'array',
        values: {
          type: 'object',
          resolve: resolve
        }
      }
    }
  }

  it("should use resolve function error on required (Person)", function(done) {
    var schema = new Schema(descriptor)
      , source = {performer: {type: 'Person'}};
    schema.validate(source, function(err, res){
      expect(res.errors.length).to.eql(1);
      expect(res.fields.name.length).to.eql(1);
      expect(res.errors[0].message).to.eql('name is required');
      done();
    });
  });

  it("should use resolve function (Person type)", function(done) {
    var schema = new Schema(descriptor)
      , source = {performer: {type: 'Person', name: 'joe'}};
    schema.validate(source, function(err, res){
      expect(err).to.eql(null);
      expect(res).to.eql(null);
      done();
    });
  });

  it("should use resolve function error on required (Group)", function(done) {
    var schema = new Schema(descriptor)
      , source = {performer: {type: 'Group'}};
    schema.validate(source, function(err, res){
      expect(res.errors.length).to.eql(1);
      expect(res.fields.name.length).to.eql(1);
      expect(res.errors[0].message).to.eql('name is required');
      done();
    });
  });

  it("should use resolve function (Group type)", function(done) {
    var schema = new Schema(descriptor)
      , source = {performer: {type: 'Group', name: 'john'}};
    schema.validate(source, function(err, res){
      expect(err).to.eql(null);
      expect(res).to.eql(null);
      done();
    });
  });

  it("should throw error on unknown type", function(done) {
    var schema = new Schema(descriptor)
      , source = {performer: {type: 'Unknown', name: 'joe'}};
    function fn() {
      schema.validate(source, function(/*err, res*/){});
    }
    expect(fn).throws(/Unknown performer type/i);
    done();
  });

  it("should use resolve function (mixed types)", function(done) {
    var schema = new Schema(mixed)
      , source = {
        performer: [
          {type: 'Person', name: 'joe'},
          {type: 'Group', name: 'john'}
        ]
      };
    schema.validate(source, function(err, res){
      expect(err).to.eql(null);
      expect(res).to.eql(null);
      done();
    });
  });

});
