var types = {};

types.integer = function(value) {
  return typeof(value) === 'number' && parseInt(value) === value;
}

types.float = function(value) {
  return typeof(value) === 'number' && !types.integer(value);
}

types.array = function(value) {
  return Array.isArray(value);
}

types.regexp = function(value) {
  if(value instanceof RegExp) {
    return true;
  }
  try {
    var re = new RegExp(value);
    return true;
  }catch(e) {
    return false;
  }
}

types.object = function(value) {
  return typeof(value) === 'object' && !types.array(value);
}

types.method = function(value) {
  return typeof(value) === 'function';
}

module.exports = types;
