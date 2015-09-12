var expect = require('chai').expect
  , schema = require('../../index');

function Component(){}

describe("async-validate:", function() {

  it("should error on type as class (instanceof)", function(done) {
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
    validator.validate({instance: new Array()}, function(errors, fields) {
      expect(errors.length).to.eql(1);
      expect(errors[0].message).to.eql('instance is not a Component');
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
    validator.validate({instance: new Component()}, function(errors, fields) {
      expect(errors).to.eql(null);
      done();
    });
  });

});
