var util = require('util');
var schema = {
  type: 'object',
  fields: {
    name: {type: 'string', required: true},
    job: {
      type: 'string',
      required: true,
      message: function(msg, params) {
        return util.format.apply(util, [msg].concat(params));
      }
    }
  }
}

module.exports = schema;
