var Component = require('../component')
  , schema = {
      type: 'object',
      fields: {
        instance: {
          type: Component,
          message: function(message, parameters) {
            message = '%s is not a %s';
            parameters[1] = this.rule.Type.name;  
            return this.format.apply(this, [message].concat(parameters));
          }
        }
      }
    }

module.exports = schema;
