function mapSeries(list, cb, complete) {
  var item = list.shift()
    , out = [];
  function run(item) {
    cb(item, function(err, result) {
      /* istanbul ignore next: not going to mock this */
      if(err) {
        return complete(err, out); 
      } 
      out.push(result);
      item = list.shift();
      if(item) {
        return run(item);
      }
      complete(null, out);
    }); 
  }
  if(item) {
    return run(item); 
  }
  complete(null, out);
}

function map(list, cb, complete) {
  var out = [];
  function run(item, index) {
    cb(item, function(err, result) {
      /* istanbul ignore next: not going to mock this */
      if(err) {
        return complete(err, out); 
      } 
      out[index] = result;
      if(out.length === list.length) {
        return complete(null, out);
      }
    }); 
  }
  list.forEach(function(item, index) {
    run(item, index);
  })
}

module.exports = {
  map: map,
  mapSeries: mapSeries
}
