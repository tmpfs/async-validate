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

// TODO: implement parallel
function map(list, cb, complete) {
  return mapSeries(list, cb, complete);
}

module.exports = {
  map: map,
  mapSeries: mapSeries
}
