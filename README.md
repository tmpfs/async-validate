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

## Synopsis

None of the existing validation packages met the requirement to asynchronously validate user input. The [validator](https://github.com/chriso/node-validator) package is a helpful utility while [validate](https://github.com/eivindfjeldstad/validate) was closer as it took a more declarative approach but does not support asynchronous operations such as checking for existence of a database or validating that an email address already exists in a database.

So this package was created to allow for asynchronous validation of user input using a declarative schema based approach.

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

## Validate

```javascript
function(source, [options], callback)
```

* `source`: The object to validate (required).
* `options`: An object describing processing options for the validation (optional).
* `callback`: A callback function to invoke when validation completes (required).

### Options

* `first`: Invoke `callback` when the first validation rule generates an error, no more validation rules are processed. If your validation involves multiple asynchronous calls (for example, database queries) and you only need the first error use this option.
* `single`: Only ever return a single error. Typically used in conjunction with `first` when a validation rule could generate multiple errors.
* `keys`: Specifies the keys on the source object to be validated. Use this option to validate fields in a determinate order or to validate a subset of the rules assigned to a schema.

Consider the rule:

```javascript
{name: {type: "string", required: true, min: 10, pattern: /^[^-].*$/}}
```

When supplied with a source object such as `{name: "-name"}` the validation rule would generate two errors, as the pattern does not match and the string length is less then the required minimum length for the field.

In this instance when you only want the first error encountered use the `single` option.

## Rules

Rules may be functions that perform validation.

```javascript
function(rule, value, callback, source, options)
```

* `rule`: The validation rule in the source descriptor that corresponds to the field name being validated. It is always assigned a `field` property with the name of the field being validated.
* `value`: The value of the source object property being validated.
* `callback`: A callback function to invoke once validation is complete. It expects to be passed an array of `Error` instances to indicate validation failure.
* `source`: The source object that was passed to the `validate` method.
* `options`: Additional options.
* `options.messages`: The object containing validation error messages.

```javascript
var schema = require('async-validate');
var ValidationError = schema.error;
var descriptor = {
  name: function(rule, value, callback, source, options) {
    var errors = [];
    if(!/^[a-z0-9]+$/.test(value)) {
      errors.push(
        new ValidationError(
          util.format("%s must be lowercase alphanumeric characters",
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
    function(rule, value, callback, source, options) {
      var errors = []; 
      // test if email address already exists in a database
      // and add a validation error to the errors array if it does
      callback(errors);
    }
  ]
}
```

### Type

Indicates the `type` of validator to use. Recognised type values are:

* `string`: Must be of type `string`.
* `number`: Must be of type `number`.
* `boolean`: Must be of type `boolean`.
* `regexp`: Must be an instance of `RegExp` or a string that does not generate an exception when creating a new `RegExp`.
* `integer`: Must be of type `number` and an integer.
* `float`: Must be of type `number` and a floating point number.
* `array`: Must be an array as determined by `Array.isArray`.
* `object`: Must be of type `object` and not `Array.isArray`.
* `enum`: Value must exist in the `enum`.
* `date`: Value must be valid as determined by `moment().isValid()`.

### Required

The `required` rule property indicates that the field must exist on the source object being validated.

### Pattern

The `pattern` rule property indicates a regular expression that the value must match to pass validation.

### Range

A range is defined using the `min` and `max` properties. For `string` and `array` types comparison is performed against the `length`, for `number` types the number must not be less than `min` nor greater than `max`.

### Length

To validate an exact length of a field specify the `len` property. For `string` and `array` types comparison is performed on the `length` property, for the `number` type this property indicates an exact match for the `number`, ie, it may only be strictly equal to `len`.

If the `len` property is combined with the `min` and `max` range properties, `len` takes precedence.

### Enumerable

To validate a value from a list of possible values use the `enum` type with a `enum` property listing the valid values for the field, for example:

```javascript
var descriptor = {
  role: {type: "enum", enum: ['admin', 'user', 'guest']}
}
```

### Date Format

Validating dates can be complex but using [moment](http://momentjs.com/) date validation is substantially easier.

If no `format` is specified for a rule that is a `date` type then it is assumed the date is ISO 8601. If a format is specified then the date is validated according to the specified format.

It is recommended you read the [moment documentation](http://momentjs.com/docs/#/parsing/is-valid/) on the `isValid` method to understand what validation is performed.

The important part is:

> Note: It is not intended to be used to validate that the input string matches the format string. Because the strictness of format matching can vary depending on the application and business requirements, this sort of validation is not included in Moment.js.

This limitation may be overcome by combining a `pattern` in a date rule, for example:

```javascript
var descriptor = {
  active: {
    type: "date",
    format: "YYYY-MM-DD",
    pattern: /^([\d]{4})-([\d]{2})-([\d]{2})$/
  }
}
```

### Whitespace

It is typical to treat required fields that only contain whitespace as errors. To add an additional test for a string that consists solely of whitespace add a `whitespace` property to a rule with a value of `true`. The rule must be a `string` type.

You may wish to sanitize user input instead of testing for whitespace, see [transform](#transform) for an example that would allow you to strip whitespace.


### Deep Rules

If you need to validate deep object properties you may do so for validation rules that are of the `object` or `array` type by assigning nested rules to a `fields` property of the rule.

```javascript
var descriptor = {
  address: {
    type: "object", required: true,
    fields: {
      street: {type: "string", required: true},
      city: {type: "string", required: true},
      zip: {type: "string", required: true, len: 8, message: "invalid zip"}
    }
  },
  name: {type: "string", required: true}
}
var validator = new schema(descriptor);
validator.validate({ address: {} }, function(errors, fields) {
  // errors for street, city, zip and name
});
```

Note that if you do not specify the `required` property on the parent rule it is perfectly valid for the field not to be declared on the source object and the deep validation rules will not be executed as there is nothing to validate against.

Deep rule validation creates a schema for the nested rules so you can also specify the `options` passed to the `schema.validate()` method.

```javascript
var descriptor = {
  address: {
    type: "object", required: true, options: {single: true, first: true},
    fields: {
      street: {type: "string", required: true},
      city: {type: "string", required: true},
      zip: {type: "string", required: true, len: 8, message: "invalid zip"}
    }
  },
  name: {type: "string", required: true}
}
var validator = new schema(descriptor);
validator.validate({ address: {} }, function(errors, fields) {
  // now only errors for street and name
});
```

The parent rule is also validated so if you have a set of rules such as:

```javascript
var descriptor = {
  roles: {
    type: "array", required: true, len: 3,
    fields: {
      0: {type: "string", required: true},
      1: {type: "string", required: true},
      2: {type: "string", required: true}
    }
  }
}
```

And supply a source object of `{roles: ["admin", "user"]}` then two errors will be created. One for the array length mismatch and one for the missing required array entry at index 2.

### Transform

Sometimes it is necessary to transform a value before validation, possibly to coerce the value or to sanitize it in some way. To do this add a `transform` function to the validation rule. The property is transformed prior to validation and re-assigned to the source object to mutate the value of the property in place.

```javascript
var schema = require('async-validate');
var sanitize = require('validator').sanitize;
var descriptor = {
  name: {
    type: "string",
    required: true, pattern: /^[a-z]+$/,
    transform: function(value) {
      return sanitize(value).trim();
    }
  }
}
var validator = new schema(descriptor);
var source = {name: " user  "};
validator.validate(source, function(errors, fields) {
  assert.equal(source.name, "user");
});
```

Without the `transform` function validation would fail due to the pattern not matching as the input contains leading and trailing whitespace, but by adding the transform function validation passes and the field value is sanitized at the same time.

## Register

To extend the recognised validation types you may `register` your own validation functions by type.

```javascript
function register(type, validator)
```

The `type` arguments should be a string indicating the `type` property of the validation rule and `validator` must be a function with the correct signature.

```javascript
var schema = require('async-validate');
var ValidationError = schema.error;
var validator = function(rule, value, callback, source) {
  var errors = [];
  var re = /^[^-][a-zA-Z0-9-]+$/;
  if(!re.test(value)) {
    errors.push(new ValidationError(
      util.format("%s is not a valid identifier", rule.field)));
  }
  callback(errors);
}
schema.register('id', validator);
```

You can then use validation rules such as `{type: "id"}`.

## Messages

Depending upon your application requirements, you may need i18n support or you may prefer different validation error messages.

The easiest way to achieve this is to assign a `message` to a rule:

```javascript
{name:{type: "string", required: true, message: "Name is required"}}
```

If you just want to change the default messages:

```javascript
var schema = require('async-validate');
schema.messages.required = "%s is a required field";  // change the message
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
var schema = require('async-validate');
var es = schema.messages.clone();
es.required = "%s es un campo obligatorio";  // change the message
var descriptor = {name:{type: "string", required: true}};
var validator = new schema(descriptor);
validator.messages(es); // ensure this schema uses the altered messages
...
```

If you are defining your own validation functions it is better practice to assign the message strings to a messages object and then access the messages via the `options.messages` property within the validation function.

## Standard Rules

Some standard rules for common validation requirements are accessible via `schema.rules.std`. You may wish to reference these rules or copy and modify them.

### Field

A typical required field:

```javascript
{type: "string", required: true, whitespace: true}
```

### Email

A basic email validation rule using a pattern:

```javascript
{type: "string", required: true, pattern: pattern.email}
```

Note validating email addresses with a regular expression is [fraught with pitfalls](http://stackoverflow.com/questions/201323/using-a-regular-expression-to-validate-an-email-address/201378#201378), use this with caution.

### URL

A simple http(s) URL rule:

```javascript
{type: "string", required: true, pattern: pattern.url}
```

### Hex

A rule for hexadecimal color values with optional leading hash:

```javascript
{type: "string", required: true, pattern: pattern.hex}
```

## License

Everything is [MIT](http://en.wikipedia.org/wiki/MIT_License). Read the [license](/freeformsystems/strike/blob/master/LICENSE) if you feel inclined.
