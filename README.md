# async-validate

Asynchronous validation for [node](http://nodejs.org).

## Installation

```
npm install async-validate
```

## Unit Tests

```
npm test
```

## Usage

Basic usage involves defining a descriptor, assigning it to a schema and passing the object to be validated and a callback function to the `validate` method of the schema:

```javascript
var schema = require('async-validate');
var descriptor = {
  name: {type: "string", required: true}
}
var validator = new schema(descriptor);
validator.validate({name: "muji"}, function(errors, fields) {
  if(errors) {
    // validation failed, errors is an array of all errors
    // fields is an object keyed by field name with an array of
    // errors per field
    return handleErrors(errors, fields);
  }
  // validation passed
});
```

Rules may be functions that perform validation. The signature for a validation function is:

```javascript
function(rule, value, callback, values)
```

* `rule`: The validation rule in the source descriptor that corresponds to the field name being validated. It is always assigned a `field` property with the name of the field being validated.
* `value`: The value of the source object property being validated.
* `callback`: A callback function to invoke once validation is complete. It expects to be passed an array of `Error` instances to indicate validation failure.
* `values`: The source object that was passed to the `validate` method.

```javascript
var schema = require('async-validate');
var ValidationError = schema.error;
var descriptor = {
  name: function(rule, value, callback, values) {
    var errors = [];
    if(!/^[a-z0-9]+$/.test(value)) {
      errors.push(
        new ValidationError(
          util.format("Field %s must be lowercase alphanumeric characters",
            rule.field)));
    }
    callback(errors);
  }
}
var validator = new schema(descriptor);
validator.validate({name: "Firstname"}, function(errors, fields) {
  if(errors) {
    return handleErrors(errors, fields);
  }
  // validation passed
});
```

It is often useful to test against multiple validation rules for a single field, to do so make the rule an array of objects, for example:

```javascript
var descriptor = {
  email: [
    {type: "string", required: true, pattern: schema.pattern.email},
    function(rule, value, callback, values) {
      var errors = []; 
      // test if email address already exists in a database
      // and add a validation error to the errors array if it does
      callback(errors);
    }
  ]
}
```

## Validate

The validate method has the signature:

```javascript
function(source, [options], callback)
```

* `source`: The object to validate - required.
* `options`: An object describing processing options for the validation.
* `callback`: A callback function to invoke when validation completes.

### Options

* `first`: Invoke `callback` when the first validation rule generates an error. 

## Rules

#### Required

Add a `required` field to the rule to validate that the property exists.

#### Type

Add a `type` field to a rule to indicate that the field must be a `typeof` the specified type. Recognised type values are:

* `string`
* `number`
* `integer`
* `float`
* `array`

#### Pattern

The `pattern` field should be a valid `RegExp` to test the value against.

#### Minimum

When testing with a `type` of `string` the `min` property determines the minimum number of characters for the string.

When testing with a `type` of `number` the `min` property indicates the number may not be less than `min`.

#### Maximum

When testing with a `type` of `string` the `max` property determines the maximum number of characters for the string.

When testing with a `type` of `number` the `max` property indicates the number may not be greater than `max`.

#### Range

Combine the `min` and `max` properties to define a validation range.

#### Whitespace

It is typical to treat required fields that only contain whitespace as errors. To add an additional test for a string that consists solely of whitespace add a `whitespace` property to a rule with a value of `true`. The rule must be a `string` type.
