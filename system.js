// schema for a schema definition
var schema = {
  type: 'object',
  required: true,
  all: {
    match: /./,
    fields: {
      additional: {type: 'boolean'},
      list: {type: 'array'},
      fields: {type: ['object', 'array']},
      format: {type: 'string'},
      len: {type: 'integer'},
      min: {type: 'integer'},
      max: {type: 'integer'},
      pattern: {type: 'regexp'},
      placeholder: {type: 'function'},
      required: {type: 'boolean'},
      test: {type: 'function'},
      type: {type: ['string', 'function'], required: true},
      values: {type: ['object', 'array']},
      whitespace: {type: 'boolean'}
    }
  }
}

module.exports = schema;
