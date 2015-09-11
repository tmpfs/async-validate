Table of Contents
=================

* [Async Validate](#async-validate)
  * [Install](#install)
  * [Usage](#usage)
  * [Guide](#guide)
    * [Plugins](#plugins)
    * [Descriptor](#descriptor)
      * [Type](#type)
      * [Required](#required)
      * [Pattern](#pattern)
      * [Range](#range)
      * [Length](#length)
      * [Enumerable](#enumerable)
      * [Date Format](#date-format)
      * [Whitespace](#whitespace)
      * [Multiple Rules](#multiple-rules)
      * [Deep Rules](#deep-rules)
    * [Transform](#transform)
    * [Messages](#messages)
    * [Standard Rules](#standard-rules)
      * [Field](#field)
      * [Email](#email)
      * [URL](#url)
      * [Hex](#hex)
    * [API](#api)
      * [Validate](#validate)
        * [Options](#options)
      * [Rules](#rules)
        * [Options](#options-1)
    * [Callback](#callback)
  * [Developer](#developer)
    * [Test](#test)
    * [Cover](#cover)
    * [Browserify](#browserify)
    * [Clean](#clean)
    * [Docs](#docs)
    * [Readme](#readme)
  * [Browser Support](#browser-support)
  * [License](#license)

Async Validate
==============

Asynchronous validation for [node](http://nodejs.org) and the browser.

## Install

```
npm i async-validate
```

## Usage

Usage involves defining a descriptor, assigning it to a schema and passing the object to be validated and a callback function to `validate()`:

```javascript
var schema = require('..')
  , descriptor = {name: {type: "string", required: true}}
  , validator = new schema(descriptor)
  , source = {};

schema.plugin(
  [require('../plugin/string')]);

validator.validate(source, function(errors, fields) {
  if(errors) {
    // validation failed, errors is an array of all errors
    // fields is an object keyed by field name with an array of
    // errors per field
    return console.dir(errors)
  }
  // validation passed
});
```

## Guide

### Plugins

To use schema types you should load plugins for the types you wish to validate:

```javascript
var schema = require('async-validate');
schema.plugin([
  require('async-validate/plugin/array'),
  require('async-validate/plugin/boolean'),
  require('async-validate/plugin/number'),
  require('async-validate/plugin/string')
])
```

As a shortcut you may use all available types with:

```javascript
require('async-validate/plugin/all');
```

See [plugins](https://github.com/freeformsystems/async-validate/blob/master/plugins) for the type plugins that ship with this module and [zephyr](https://github.com/socialally/zephyr) for documentation on the plugin system.

The [plugin fixture](https://github.com/freeformsystems/async-validate/blob/master/test/fixtures/plugin.js) and the [plugin test](https://github.com/freeformsystems/async-validate/blob/master/test/spec/plugin.js) provide an example of creating a type plugin.

### Descriptor

A descriptor defines the validation rules as a map of fields to rules.

This section describes the rule fields recognised by the module plugins.

#### Type

Indicates the `type` of validator to use. A type corresponds to a plugin function and the plugin should have been loaded.

Recognised type values are:

* `string`: Must be of type `string`.
* `number`: Must be of type `number`.
* `boolean`: Must be of type `boolean`.
* `method`: Must be of type `function`.
* `regexp`: Must be an instance of `RegExp` or a string that does not generate an exception when creating a new `RegExp`.
* `integer`: Must be of type `number` and an integer.
* `float`: Must be of type `number` and a floating point number.
* `array`: Must be an array as determined by `Array.isArray`.
* `object`: Must be of type `object` and not `Array.isArray`.
* `enum`: Value must exist in the `enum`.
* `date`: Value must be valid as determined by `moment().isValid()`.

#### Required

The `required` rule property indicates that the field must exist on the source object being validated.

#### Pattern

The `pattern` rule property indicates a regular expression that the value must match to pass validation.

#### Range

A range is defined using the `min` and `max` properties. For `string` and `array` types comparison is performed against the `length`, for `number` types the number must not be less than `min` nor greater than `max`.

#### Length

To validate an exact length of a field specify the `len` property. For `string` and `array` types comparison is performed on the `length` property, for the `number` type this property indicates an exact match for the `number`, ie, it may only be strictly equal to `len`.

If the `len` property is combined with the `min` and `max` range properties, `len` takes precedence.

#### Enumerable

To validate a value from a list of possible values use the `enum` type with a `enum` property listing the valid values for the field, for example:

```javascript
var descriptor = {
  role: {type: "enum", enum: ['admin', 'user', 'guest']}
}
```

#### Date Format

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

#### Whitespace

It is typical to treat required fields that only contain whitespace as errors. To add an additional test for a string that consists solely of whitespace add a `whitespace` property to a rule with a value of `true`. The rule must be a `string` type.

You may wish to sanitize user input instead of testing for whitespace, see [transform](#transform) for an example that would allow you to strip whitespace.

#### Multiple Rules

It is often useful to test against multiple validation rules for a single field, to do so make the rule an array of objects, for example:

```javascript
var descriptor = {
  email: [
    {type: "string", required: true},
    function(opts, cb) {
      // test if email address already exists in a database
      // and add a validation error to the errors array if it does
      cb(this.errors);
    }
  ]
}
```

#### Deep Rules

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

Without the `transform` function validation would fail due to the pattern not matching as the input contains leading and trailing whitespace, but by adding the transform function validation passes and the field value is sanitized at the same time.

### Messages

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

### Standard Rules

Some standard rules for common validation requirements are accessible, you may wish to reference these rules or copy and modify them.

These rules must be required to be used: `require('async-validate/std-rules')`.

#### Field

A typical required field:

```javascript
{type: "string", required: true, whitespace: true}
```

#### Email

A basic email validation rule using a pattern:

```javascript
{type: "string", required: true, pattern: pattern.email}
```

Note validating email addresses with a regular expression is [fraught with pitfalls](http://stackoverflow.com/questions/201323/using-a-regular-expression-to-validate-an-email-address/201378#201378), use this with caution.

#### URL

A simple http(s) URL rule:

```javascript
{type: "string", required: true, pattern: pattern.url}
```

#### Hex

A rule for hexadecimal color values with optional leading hash:

```javascript
{type: "string", required: true, pattern: pattern.hex}
```

```javascript
var schema = require('..')
  , descriptor = {
    name: {
      type: "string",
      required: true, pattern: /^[a-z]+$/,
      transform: function(value) {
        return value.trim();
      }
    }
  }
  , validator = new schema(descriptor)
  , source = {name: " user  "};

schema.plugin([require('../plugin/string')]);

validator.validate(source, function(errors, fields) {
  console.dir(source.name);
});
```

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

## Developer

### Test

Run the test specifications:

```
npm test
```

### Cover

Generate code coverage:

```
npm run cover
```

### Browserify

Create a standalone browserify build:

```
npm run browserify
```

### Clean

Remove generated files:

```
npm run clean
```

### Docs

To generate all documentation:

```
npm run docs
```

### Readme

Generate the project readme file [mdp](https://github.com/freeformsystems/mdp):

```
npm run readme
```

## Browser Support

<table>
<thead>
<tr>
<th><img src="https://cloud.githubusercontent.com/assets/398893/3528328/23bc7bc4-078e-11e4-8752-ba2809bf5cce.png" alt="Chrome"></th>
<th><img src="https://cloud.githubusercontent.com/assets/398893/3528329/26283ab0-078e-11e4-84d4-db2cf1009953.png" alt="Firefox"></th>
<th><img src="https://cloud.githubusercontent.com/assets/398893/3528330/27ec9fa8-078e-11e4-95cb-709fd11dac16.png" alt="Opera"></th>
<th><img src="https://cloud.githubusercontent.com/assets/398893/3528331/29df8618-078e-11e4-8e3e-ed8ac738693f.png" alt="Safari"></th>
</tr>
</thead>
<tbody>
<tr>
<td>Latest ✔ (tested on 39)</td>
<td>Latest ✔ (tested on 33)</td>
<td>Latest ✔ (tested on 25)</td>
<td>Latest ✔ (tested on 8)</td>
</tr>
</tbody>
</table>
## License

Everything is [MIT](http://en.wikipedia.org/wiki/MIT_License). Read the [license](https://github.com/freeformsystems/async-validate/blob/master/LICENSE) if you feel inclined.

Generated by [mdp(1)](https://github.com/freeformsystems/mdp).

[node]: http://nodejs.org
[npm]: http://www.npmjs.org
[mdp]: https://github.com/freeformsystems/mdp
[zephyr]: https://github.com/socialally/zephyr
