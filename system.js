// schema for a schema definition
var schema = {
  type: 'object',
  fields: {
    additional: {type: 'boolean'},
    fields: {type: 'object'},
    format: {type: 'string'},
    len: {type: 'integer'},
    list: {type: 'array'},
    local: {type: 'boolean'},
    min: {type: 'integer'},
    max: {type: 'integer'},
    match: {type: 'regexp'},
    pattern: {type: 'regexp'},
    placeholder: {type: 'function'},
    required: {type: 'boolean'},
    test: {type: 'function'},
    type: {
      type: ['string', 'function', 'array'],
      required: true
    },
    values: {type: ['object', 'array']},
    whitespace: {type: 'boolean'}
  }
}

module.exports = schema;
