### Messages

Depending upon your application requirements, you may need i18n support or you may prefer different validation error messages.

The easiest way to achieve this is to assign a `message` to a rule:

```javascript
{name:{type: "string", required: true, message: "Name is required"}}
```

You may also use a function for the rule message, it is invoked in the scope of the [Rule](#rule) and passed the original message and replacement parameters:

```javascript
var descriptor = {
  type: 'object',
  fields: {
    name: {
      type: "string",
      required: true,
      message: function(message, parameters) {
        return this.field + ' is required';
      }
    }
  }
}
```

If you just want to change the default messages:

```javascript
var Schema = require('async-validate')
  , messages = require('async-validate/messages')
  , descriptor = {
      type: 'object',
      fields: {
        name:{type: "string", required: true}}
      }
    }
  , schema;
messages.required = "%s is a required field";
schema = new Schema(descriptor, {messages: messages});
```

Potentially you may require the same schema validation rules for different languages, in which case duplicating the schema rules for each language does not make sense.

In this scenario you could just require your own messages file for the language and assign it to the schema:

```javascript
var Schema = require('async-validate')
  , messages = require('messages-es')
  , descriptor = {
      type: 'object',
      fields: {
        name:{type: "string", required: true}}
      }
    }
  , schema = new Schema(descriptor, {messages: messages});
```

If you are defining your own rule functions it is better practice to assign the message strings to a messages object and then access the messages via the `this.messages` property within the function.
