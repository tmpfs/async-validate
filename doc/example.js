// build the examples to markdown
var fs = require('fs')
  , path = require('path')
  , async = require('async')
  , exec = require('child_process').execSync
  , dir = path.join(__dirname, 'example')
  , contents = fs.readdirSync(dir);

contents = contents.map(function(file) {
  return path.join(dir, file);
});

console.log('### Examples\n');
async.eachSeries(contents, function(file, cb) {
  var name = path.basename(file, '.js')
    , js = fs.readFileSync(file)
    , cmd = 'node ' + file
    , res = exec(cmd);

  console.log('#### %s\n', name);
  console.log('```javascript\n%s\n```\n', js);


  console.log('```\n%s\n```\n', res);

  cb();
}, function(err) {
  if(err) {
    throw err; 
  }
});
