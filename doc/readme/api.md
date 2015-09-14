### API

#### Schema

```javascript
function Schema(descriptor, [opts])
```

Encapsulates the rules associated with a descriptor and the logic for performing validation.

##### messages

```javascript
function messages([messages])
```

Get or set the messages associated with the schema.

##### validate

```javascript
function validate(source, [options], cb)
```

Validates a source object against the schema rules.

* `source`: The object to validate.
* `options`: An object describing processing options for the validation.
* `cb`: Callback function to invoke when validation completes.

Options:

* `first`: Invoke callback when the first validation rule generates an error.
* `single`: Only ever return a single error.
* `bail`: Shorthand for `single` and `first`.
* `parallel`: A boolean indicating that the validation should be executed in parallel.
* `field`: Field name for the source object, default is `source` when not specified.
* `vars`: Object map of variables to assign to each rule.

##### Schema.plugin

```javascript
function plugin(plugins)
```

Static plugin loader method; accepts an array of plugin functions.

##### Schema.clone

```javascript
function clone(source, [target])
```

Static clone; deep copies simple objects and arrays, `RegExp` instances are passed by reference.

#### Reason

```javascript
function Reason(id, [opts])
```

Represents the reason for a validation error, may be created using `getReason()`.

You must supply a reason `id`; if `opts` are passed they are assigned as properties of the reason instance. When `toString()` is called on a `Reason` instance the `id` is returned.

#### Rule

```javascript
function Rule(opts)
```

Encapsulates the data associated with a validation rule and the value to be validated. Rule functions are invoked in the scope of a `Rule` instance which exposes the following public fields:

* `rule`: The validation rule in the schema descriptor.
* `value`: The value of the source object property being validated.
* `field`: The name of the field being validated.
* `source`: The source object passed to `validate()`.
* `messages`: Reference to the schema messages.
* `errors`: Array of errors for the field validation.
* `reasons`: Map of default error reasons.

##### isRoot

```javascript
function isRoot()
```

Determine if this validation is being performed against the root source object.

##### getReason

```javascript
function getReason(id, [opts])
```

Create a reason for a validation error, returns a `Reason` instance suitable for passing as the first argument to [raise](#raise).

##### raise

```javascript
function raise([reason], message, ...)
```

Adds an error message to the list of errors encountered during validation of a value.

The first argument may optionally be a `Reason` instance returned by `getReason()` allowing a user to associate an identifier with the validation error and optional additional information. A validation error generated with a `Reason` has a `reason` field referencing the supplied reason.

When replacement parameters are supplied the behaviour is identical to `util.format`.

##### format

```javascript
function format(message, ...)
```

Format a message with replacement parameters like `util.format`.

Useful when a rule declares `message` as a function and wishes to construct the error message with parameters.

##### validates

```javascript
function validates()
```

Returns a `boolean` derived from the rule `required` property and other factors to determine if the value should be subject to the validation rule, typically invoked within a rule validation function.

##### diff

```javascript
function diff(expected, received)
```

Compare two arrays, return `false` if they are equal otherwise return an array that is the difference between the supplied arrays.

##### required

```javascript
function required()
```

Validate a required field, typically invoked from a rule function, raises an error if a required field is not present.

##### pattern

```javascript
function pattern()
```

Validate using a regexp pattern, typically invoked from a rule function, raises an error if a value fails to match a rule regexp pattern.

##### range

```javascript
function range()
```

Validates that a value falls within a given range or is of a specific length, typically invoked from a rule function, raises an error if a value is out of bounds.
