### API

#### Validate

```javascript
function(source, [options], callback)
```

* `source`: The object to validate (required).
* `options`: An object describing processing options for the validation (optional).
* `callback`: Callback function to invoke when validation completes (required).

##### Options

* `first`: Invoke `callback` when the first validation rule generates an error, no more validation rules are processed. If your validation involves multiple asynchronous calls (for example, database queries) and you only need the first error use this option.
* `single`: Only ever return a single error. Typically used in conjunction with `first` when a validation rule could generate multiple errors.
* `keys`: Specifies the keys on the source object to be validated. Use this option to validate fields in a determinate order or to validate a subset of the rules assigned to a schema.
* `parallel`: A boolean indicating that the validation should be executed in parallel.

Consider the rule:

```javascript
{name: {type: "string", required: true, min: 10, pattern: /^[^-].*$/}}
```

When supplied with a source object such as `{name: "-name"}` the validation rule would generate two errors, as the pattern does not match and the string length is less then the required minimum length for the field.

In this instance when you only want the first error encountered use the `single` option.

#### Rules

Rules may be functions that perform validation.

```javascript
function(opts, cb)
```

##### Options

The options object has the following fields:

* `rule`: The validation rule in the source descriptor that corresponds to the field name being validated. It is always assigned a `field` property with the name of the field being validated.
* `value`: The value of the source object property being validated.
* `source`: The source object that was passed to the `validate` method.
* `options`: The options passed to `validate()`.
* `messages`: Reference to the messages assigned to `options`.
* `errors`: Array of errors for the field validation.

The options passed to `validate` are passed on to the validation functions so that you may reference transient data (such as model references) in validation functions. However, some option names are reserved; if you use these properties of the options object they are overwritten. The reserved properties are `messages`.

### Callback

The callback function to invoke once validation is complete. It expects to be passed an array of `Error` instances to indicate validation failure.
