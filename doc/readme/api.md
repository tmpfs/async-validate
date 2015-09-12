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
* `field`: Field name for the root object, default is `source` when not specified.
* `rules`: Rules to apply to the root source object, may be an array or a single rule object.

Consider the rule:

```javascript
{name: {type: "string", required: true, min: 10, pattern: /^[^-].*$/}}
```

When supplied with a source object such as `{name: "-name"}` the validation rule would generate two errors, as the pattern does not match and the string length is less then the required minimum length for the field.

In this instance when you only want the first error encountered use the `single` option.

#### Rules

Rules are functions that perform validation. They are invoked in the scope of a [validator](/lib/validator.js) so you should not call `bind()` on validation rule functions.

```javascript
function(cb)
```

* `cb`: Callback function to invoke when validation completes, expects an array of error instances to be passed.

##### Scope

The scope of the rule function exposes the fields:

* `rule`: The validation rule in the source descriptor that corresponds to the field name being validated.
* `value`: The value of the source object property being validated.
* `field`: The name of the field being validated.
* `source`: The source object that was passed to the `validate` method.
* `options`: The options passed to `validate()`.
* `messages`: Reference to the messages assigned to `options`.
* `errors`: Array of errors for the field validation.
