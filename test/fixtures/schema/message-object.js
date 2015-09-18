var schema = {
  type: 'object',
  fields: {
    num: {
      type: 'number', min: 0, max: 10,
      message: {
        min: 'Number may not be below zero',
        max: 'Number may not be above ten'
      }
    }
  }
}

module.exports = schema;
