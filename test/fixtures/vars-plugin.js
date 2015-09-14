function id(cb) {
  var rule = this
    , val = this.value;

  this.model.findUserById(val, function(err, user) {
    if(err) {
      return cb(err); 
    }
    if(!user) {
      rule.raise('user not found for id %s', val); 
    }
    cb();
  })
}

module.exports = function() {
  // add static `id` type method
  this.main.id = id;
}
