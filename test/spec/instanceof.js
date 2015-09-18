var expect = require('chai').expect
  , schema = require('../../index');

function Component(){}

describe("async-validate:", function() {

  it("should error on type as class (instanceof)", function(done) {
    var descriptor = {
      instance: {
        type: Component
      }
    }
    var validator = new schema(descriptor);
    validator.validate({instance: []}, function(err, res) {
      expect(res.errors.length).to.eql(1);
      expect(res.errors[0].message).to.eql(
        'instance is not an instance of Component');
      done();
    });
  });

  it("should error on type as class (instanceof) anonymous", function(done) {
    var descriptor = {
      instance: {
        type: function(){}
      }
    }
    var validator = new schema(descriptor);
    validator.validate({instance: []}, function(err, res) {
      expect(res.errors.length).to.eql(1);
      expect(res.errors[0].message).to.eql(
        'instance is not an instance of function (anonymous)');
      done();
    });
  });

  it("should error on type as class (instanceof) w/ message", function(done) {
    var descriptor = {
      instance: {
        type: Component,
        message: function(message, parameters) {
          message = '%s is not a %s';
          parameters[1] = this.rule.Type.name;  
          return this.format.apply(this, [message].concat(parameters));
        }
      }
    }
    var validator = new schema(descriptor);
    validator.validate({instance: []}, function(err, res) {
      expect(res.errors.length).to.eql(1);
      expect(res.errors[0].message).to.eql('instance is not a Component');
      done();
    });
  });

  it("should validate on type as class (instanceof)", function(done) {
    var descriptor = {
      instance: {
        type: Component,
        message: function(message, parameters) {
          message = '%s is not a %s';
          parameters[1] = this.rule.Type.name;  
          return this.format.apply(this, [message].concat(parameters));
        }
      }
    }
    var validator = new schema(descriptor);
    validator.validate({instance: new Component()}, function(err, res) {
      expect(err).to.eql(null);
      expect(res).to.eql(null);
      done();
    });
  });

});
