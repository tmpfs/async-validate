### Messages

Depending upon your application requirements, you may need i18n support or you may prefer different validation error messages.

The easiest way to achieve this is to assign a `message` to a rule:

```javascript
{name:{type: "string", required: true, message: "Name is required"}}
```

If you just want to change the default messages:

```javascript
var schema = require('async-validate')
  , messages = require('async-validate/messages');
messages.required = "%s is a required field";  // change the message
...
```

Potentially you may require the same schema validation rules for different languages, in which case duplicating the schema rules for each language does not make sense.

In this scenario you could just require your own messages file for the language and assign it to the schema:

```javascript
var schema = require('async-validate');
var es = require('messages-es');
var descriptor = {name:{type: "string", required: true}};
var validator = new schema(descriptor);
validator.messages(es);
...
```

Or you could clone a default messages instance and then assign language specific messages to the schema using the `messages` method.

```javascript
var schema = require('async-validate')
  , messages = require('async-validate/messages')
var es = schema.clone(messages);
es.required = "%s es un campo obligatorio";  // change the message
var descriptor = {name:{type: "string", required: true}};
var validator = new schema(descriptor);
validator.messages(es); // ensure this schema uses the altered messages
...
```

If you are defining your own validation functions it is better practice to assign the message strings to a messages object and then access the messages via the `this.messages` property within the validation function.
