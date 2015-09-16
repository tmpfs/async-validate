// build the browser index file
// unfortunately require-dir was
// not working with browserify
var path = require('path')
  , fs = require('fs')
  , files = ['global']
  // relative to project as cwd
  , contents = fs.readdirSync('test/spec')

contents = contents.map(function(file) {
  return 'spec/' + path.basename(file, '.js'); 
});

files = files.concat(contents);

files.forEach(function(file) {
  console.log('require(\'./%s\')', file);
});

//console.dir(contents)
