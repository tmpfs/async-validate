var data = {
  foo: {id: 'foo'},
  bar: {id: 'bar'}
}

// mock model class (vars)
function Model() {}

function findUserById(id, cb) {
  // normally find in a database
  return cb(null, data[id]);
}

Model.prototype.findUserById = findUserById;

module.exports = Model;
