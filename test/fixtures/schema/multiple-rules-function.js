var email = require('../email') 
  , schema = {
      type: 'object',
      fields: {
        email: [
          {type: 'string', pattern: email, required: true},
          function(cb) {
            var email = 'user@example.com';
            if(this.value === email) {
              this.raise('Email address %s already exists', email);
            }
            cb();
          }
        ]
      }
    }

module.exports = schema;
