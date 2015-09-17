function mapSeries(list, cb, complete) {
  var item = list.shift()
    , out = [];
  function run(item) {
    cb(item, function(err, result) {
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
  var out = []
    , e;
  function run(item, index) {
    cb(item, function(err, result) {
      // do not call complete again on error
      // condition
      if(e) {
        return; 
      }else if(err) {
        e = err;
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
  });
}

module.exports = {
  map: map,
  mapSeries: mapSeries
}
