### API

#### Schema

```javascript
function Schema(descriptor, [opts])
```

Encapsulates the rules associated with a descriptor and the logic for performing validation.

##### validate

```javascript
function(source, [options], cb)
```

Validates a source object against the rules in the descriptor associated with the schema.

* `source`: The object to validate (required).
* `options`: An object describing processing options for the validation (optional).
* `cb`: Callback function to invoke when validation completes (required).

###### Options

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

#### Reason

```javascript
function Reason(id, [opts])
```

Represents the reason for a validation error, may be created using `getReason()`.

You must supply a reason `id`; if `opts` are passed they are assigned as properties of the reason instance. When `toString()` is called on a `Reason` instance the `id` is returned.

#### Validator

```javascript
function Validator(opts)
```

Encapsulates the data associated with a validation rule and the value to be validated. Rule functions are invoked in the scope of a `Validator` instance which exposes the following public fields:

* `rule`: The validation rule in the source descriptor that corresponds to the field name being validated.
* `value`: The value of the source object property being validated.
* `field`: The name of the field being validated.
* `source`: The source object that was passed to the `validate` method.
* `options`: The options passed to `validate()`.
* `messages`: Reference to the messages assigned to `options`.
* `errors`: Array of errors for the field validation.

##### isRoot

```javascript
function isRoot()
```

Determine if this validation is being performed against the root source object.

##### getReason

```javascript
function getReason(id, [opts])
```

Create a reason for a validation error.

Returns a `Reason` instance suitable for passing as the first argument to [raise](#raise).

##### raise

```javascript
function raise([reason], message, ...)
```

Adds an error message to the list of errors encountered during validation of a value.

The first argument may optionally be a `Reason` instance returned by `getReason()` allowing a user to associate an identifier with the validation error and optional additional information. A validation error generated with a `Reason` has a `reason` field referencing the supplied reason.

When replacement parameters are supplied the behaviour is identical to `util.format`.

##### shouldValidate

```javascript
function shouldValidate()
```

Returns a `boolean` derived from the rule `required` property and other factors to determine if the value should be subject to the validation rule, typically invoked within a rule validation function.

##### hasAdditionalFields

```javascript
function hasAdditionalFields(expected, received)
```

Compare two arrays, return `false` if they are equal otherwise return an array that is the difference between the supplied arrays.

##### required

```javascript
function required()
```

Validate a required field, typically invoked from the validation rule function.

Raises an error if a required field is not present.

##### pattern

```javascript
function pattern()
```

Validate using a regexp pattern, typically invoked from the validation rule function.

Raises an error if a value fails to match a rule regexp pattern.
