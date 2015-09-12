var validator = require('../lib/validator');
validator.plugin([
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
