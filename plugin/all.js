var rule = require('../lib/rule');
rule.plugin([
  require('./util'),
  require('./array'),
  require('./boolean'),
  require('./date'),
  require('./enum'),
  require('./float'),
  require('./integer'),
  require('./method'),
  require('./null'),
  require('./number'),
  require('./object'),
  require('./pattern'),
  require('./regexp'),
  require('./string')
]);
