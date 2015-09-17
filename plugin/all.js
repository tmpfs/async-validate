var rule = require('../lib/rule');
rule.plugin([
  require('./array'),
  require('./boolean'),
  require('./date'),
  require('./enum'),
  require('./float'),
  require('./integer'),
  require('./function'),
  require('./null'),
  require('./number'),
  require('./object'),
  require('./regexp'),
  require('./string'),
  require('./util')
]);
