### API

#### Schema

```javascript
function Schema(rules, [opts])
```

Encapsulates the rules associated with a schema and the logic for performing validation.

* `rules`: The schema rules.
* `opts`: Configuration options.

Options:

* `messages`: An alternative messages object for the schema.

##### messages

```javascript
function messages([messages])
```

Get or set the messages associated with the schema.

##### validate

```javascript
function validate(source, [opts], cb)
```

Validates a source object against the schema rules.

* `source`: The object to validate.
* `opts`: Map of processing options for the validation.
* `cb`: Callback function to invoke when validation completes.

Options:

* `first`: Invoke callback when the first validation rule generates an error.
* `single`: Only ever return a single error.
* `bail`: Shorthand for `single` and `first`.
* `messages`: Overrides the schema messages.
* `parallel`: A boolean indicating that the validation should be executed in parallel.
* `field`: Field name for the source object, default is `source` when not specified.
* `parent`: Parent object for the `source` value.
* `state`: Object to be used as the initial user data state.
* `vars`: Object map of variables to assign to each rule.
* `literal`: If `true` do not use parameter replacement for messages, pass through literally.

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

#### Rule

```javascript
function Rule(opts)
```

Encapsulates the data associated with a validation rule and the value to be validated. Rule functions are invoked in the scope of a `Rule` instance which exposes the following public fields:

* `rule`: The validation rule in the schema descriptor.
* `value`: The value of the property being validated.
* `field`: The name of the property being validated.
* `parent`: The parent object that declares the property.
* `source`: The source object passed to `validate()`.
* `messages`: Reference to the schema messages.
* `errors`: Array of errors for the field validation.
* `state`: User data for validation state.
* `reasons`: Map of default error reasons.

##### isRoot

```javascript
function isRoot()
```

Determine if validation is being performed against the root source object.

##### reason

```javascript
function reason(id, [opts])
```

Create a reason for a validation error, returns a `Reason` instance suitable for passing as the first argument to [raise](#raise).

##### raise

```javascript
function raise([reason], message, ...)
```

Adds an error message to the list of errors encountered during validation of a value.

The first argument may optionally be a `Reason` instance returned by `reason()` allowing a user to associate an identifier with the validation error and optional meta data. An error raised with a `Reason` has a `reason` field referencing the supplied reason.

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

Returns a `boolean` derived from the rule `required` property and other factors to determine if the value should be subject to validation.

##### diff

```javascript
function diff(expected, received)
```

Compare two arrays, return `false` if they are equal otherwise return an array that is the difference between the supplied arrays.

#### Error

The errors created by [raise](#raise) are assigned the following public fields:

* `key`: Unique key for the error, eg: `address.name`.
* `field`: The name of the property that failed validation.
* `value`: The value of the property.
* `parent`: The parent object that declares the property.
* `reason`: A [Reason](#reason) for the error when available.

#### Reason

```javascript
function Reason(id, [opts])
```

Represents the reason for a validation error, may be created using `reason()`.

You must supply a reason `id`; if `opts` are passed they are assigned as properties of the reason instance. When `toString()` is called on a `Reason` instance the `id` is returned.

