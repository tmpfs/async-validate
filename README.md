Table of Contents
=================

* [Async Validate](#async-validate)
  * [Install](#install)
  * [Usage](#usage)
  * [Guide](#guide)
    * [Rules](#rules)
      * [Inline Rule](#inline-rule)
      * [Assigned Rule](#assigned-rule)
      * [Plugin Rule](#plugin-rule)
      * [Multiple Rules](#multiple-rules)
      * [Deep Rules](#deep-rules)
    * [Errors](#errors)
    * [Plugins](#plugins)
    * [Descriptor](#descriptor)
      * [Type Identifier](#type-identifier)
      * [Additional](#additional)
      * [Fields](#fields)
      * [Message](#message)
      * [Required](#required)
      * [Pattern](#pattern)
      * [Range](#range)
      * [Length](#length)
      * [Values](#values)
      * [Enumerable](#enumerable)
      * [Date Format](#date-format)
      * [Whitespace](#whitespace)
    * [Messages](#messages)
    * [Transform](#transform)
    * [Standard Rules](#standard-rules)
    * [API](#api)
      * [Schema](#schema)
        * [messages](#messages)
        * [validate](#validate)
        * [Schema.plugin](#schemaplugin)
        * [Schema.clone](#schemaclone)
      * [Reason](#reason)
      * [Validator](#validator)
        * [isRoot](#isroot)
        * [getReason](#getreason)
        * [raise](#raise)
        * [format](#format)
        * [shouldValidate](#shouldvalidate)
        * [hasAdditionalFields](#hasadditionalfields)
        * [required](#required)
        * [pattern](#pattern)
        * [type](#type)
        * [range](#range)
  * [Developer](#developer)
    * [Test](#test)
    * [Cover](#cover)
    * [Browserify](#browserify)
    * [Clean](#clean)
    * [Docs](#docs)
    * [Readme](#readme)
  * [License](#license)

Async Validate
==============

Asynchronous validation for [node](http://nodejs.org) and the browser.

## Install

```
npm i async-validate
```

## Usage

Usage involves defining a descriptor, assigning it to a schema using the necessary plugins and calling validate:

```javascript
var Schema = require('..')
  , descriptor = {name: {type: "string", required: true}}
  , schema = new Schema(descriptor)
  , source = {};

Schema.plugin([require('../plugin/string')]);

schema.validate(source, function(errors, fields) {
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

### Rules

```javascript
function rule(cb)
```

Rules are functions that perform validation of a value, they are invoked in the scope of a validator ([file](https://github.com/freeformsystems/async-validate/blob/master/lib/validator.js), [api docs](#validator)).

A rule function can access all relevant properties and methods using `this` and should [raise](#raise) an error if `this.value` fails a validation test, see [errors](#errors).

The [plugin rule](#plugin-rule) method of declaring rule functions is preferred as it is the most modular.

#### Inline Rule

The rule function is assigned directly to the field:

```javascript
var descriptor = {
  id: function(cb) {
    // if this.value has error condition call this.raise() 
    cb();
  }
}
```

#### Assigned Rule

Assigned to the `validator` field so that you may pass data from the rule to the function:

```javascript
var descriptor = {
  id: {
    foo: 'bar',
    validator: function(cb) {
      console.log(this.foo);
      // if this.value has error condition call this.raise() 
      cb();
    }
  }
}
```

#### Plugin Rule

Plugin that assigns the rule function as a static method.

Create a plugin module:

```javascript
module.exports = function() {
  // declare static rule function with name `id`
  this.main.id = function id(cb) {
    // if this.value has error condition call this.raise() 
    cb();
  }
}
```

Load and use the plugin:

```javascript
var Schema = require('async-validate');
Schema.plugin([require('./rule')]);
var descriptor = {
  id: {type: 'id'}
}
```

The static `id` method will then be invoked for every rule of type `id`, this is the most portable style as it enables easily moving validation rules into modules and packages that may be shared.

#### Multiple Rules

It is often useful to test against multiple validation rules for a single field, to do so make the rule an array of objects, for example:

```javascript
var descriptor = {
  email: [
    {type: "string", required: true},
    function(cb) {
      // test if email address (this.value) already exists 
      // in a database and call this.raise() if it does
      cb();
    }
  ]
}
```

#### Deep Rules

If you need to validate deep object properties you may do so for validation rules that are of the `object` or `array` type by assigning nested rules to a `fields` property of the rule.

```javascript
var descriptor = {
  name: {type: "string", required: true},
  address: {
    type: "object",
    required: true,
    fields: {
      street: {type: "string", required: true},
      city: {type: "string", required: true},
      zip: {type: "string", required: true, len: 8, message: "invalid zip"}
    }
  }
}
var validator = new schema(descriptor);
validator.validate({address: {}}, function(errors, fields) {
  // errors for name, street, city, zip
});
```

Note that if you do not specify the `required` property on the parent rule it is perfectly valid for the field not to be declared on the source object and the deep validation rules will not be executed as there is nothing to validate against.

Deep rule validation creates a schema for the nested rules so you can also specify the `options` passed to the `schema.validate()` method.

```javascript
var descriptor = {
  name: {type: "string", required: true},
  address: {
    type: "object",
    required: true,
    options: {single: true, first: true},
    fields: {
      street: {type: "string", required: true},
      city: {type: "string", required: true},
      zip: {type: "string", required: true, len: 8, message: "invalid zip"}
    }
  }
}
var validator = new schema(descriptor);
validator.validate({address: {}}, function(errors, fields) {
  // now only errors for name and street
});
```

The parent rule is also validated so if you have a set of rules such as:

```javascript
var descriptor = {
  roles: {
    type: "array",
    required: true,
    len: 3,
    fields: {
      0: {type: "string", required: true},
      1: {type: "string", required: true},
      2: {type: "string", required: true}
    }
  }
}
```

And supply a source object of `{roles: ["admin", "user"]}` then two errors will be created. One for the array length mismatch and one for the missing required array entry at index 2.

### Errors

To raise an error in a validation rule call [raise](#raise), the signature for raise is equivalent to `util.format` except that it may also accept a [Reason](#reason) as the first argument.

```javascript
function id(cb) {
  if(!/^[a-z0-9-]+$/i.test(this.value)) {
    this.raise('%s is not a valid id', this.field); 
  }
  cb();
}
```

Decorate the error with a reason:

```javascript
function id(cb) {
  var reason;
  if(!/^[a-z0-9-]+$/i.test(this.value)) {
    reason = this.getReason(
      'id', {description: 'Field value failed pattern match'});
    this.raise(reason, '%s is not a valid id', this.field); 
  }
  cb();
}
```

Adding a reason allows associating an identifier with an error and optional meta data about the error reason.

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

See [plugins](https://github.com/freeformsystems/async-validate/blob/master/plugin) for the type plugins that ship with this module and [zephyr](https://github.com/socialally/zephyr) for documentation on the plugin system.

The [plugin fixture](https://github.com/freeformsystems/async-validate/blob/master/test/fixtures/plugin.js) and the [plugin test](https://github.com/freeformsystems/async-validate/blob/master/test/spec/plugin.js) provide an example of creating a type plugin.

### Descriptor

A descriptor defines the validation rules as a map of fields to rules, this section describes the recognised rule properties.

#### Type Identifier

The `type` rule property indicates the type of validator to use, a type corresponds to a plugin function and the plugin should have been loaded.

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

When the `object` plugin has been loaded the `type` field may be a function in which case the value must be an `instanceof` the function assigned to `type`.

#### Additional

When a rule is of the `object` type and `additional` is set to `false` an error is raised if the source object contains any properties not in the schema.

#### Fields

Rules of the `object` and `array` type may declare a `fields` object which declares a nested descriptor, see [deep rules](#deep-rules).

#### Message

The `message` rule property defines the error message when validation fails, it overrides any default message. The property may be a `string` or `function`, see [messages](#messages).

#### Required

The `required` rule property indicates that the field must exist on the source object being validated.

#### Pattern

The `pattern` rule property is a regular expression that the value must match to pass validation.

#### Range

A range is defined using the `min` and `max` properties. For `string` and `array` types comparison is performed against the `length`, for `number` types the number must not be less than `min` nor greater than `max`.

#### Length

To validate an exact length of a field specify the `len` property. For `string` and `array` types comparison is performed on the `length` property, for the `number` type this property indicates an exact match for the `number`, ie, it may only be strictly equal to `len`.

If the `len` property is combined with the `min` and `max` range properties, `len` takes precedence.

#### Values

Used with the `array` type as a shorthand for validating array values, may be an `object` or `array` containing validation rules.

When `values` is an object it is applied to all array elements in the source array otherwise each `values` entry is compared against each source array entry which allows mixed types to be used in arrays.

Note that `values` is expanded to `fields`, see [deep rules](#deep-rules).

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

### Messages

Depending upon your application requirements, you may need i18n support or you may prefer different validation error messages.

The easiest way to achieve this is to assign a `message` to a rule:

```javascript
{name:{type: "string", required: true, message: "Name is required"}}
```

You may also use a function for the rule message, it is invoked in the scope of the rule validator and passed the original message and replacement parameters:

```javascript
var descriptor = {
  name: {
    type: "string",
    required: true,
    message: function(message, parameters) {
      return this.field + ' is required';
    }
  }
}
```

If you just want to change the default messages:

```javascript
var schema = require('async-validate')
  , messages = require('async-validate/messages');
messages.required = "%s is a required field";  // change the message
```

Potentially you may require the same schema validation rules for different languages, in which case duplicating the schema rules for each language does not make sense.

In this scenario you could just require your own messages file for the language and assign it to the schema:

```javascript
var schema = require('async-validate');
var es = require('messages-es');
var descriptor = {name:{type: "string", required: true}};
var validator = new schema(descriptor);
validator.messages(es);
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
```

If you are defining your own validation functions it is better practice to assign the message strings to a messages object and then access the messages via the `this.messages` property within the validation function.

### Transform

Sometimes it is necessary to transform a value before validation, possibly to coerce the value or to sanitize it in some way. To do this add a `transform` function to the validation rule. The property is transformed prior to validation and re-assigned to the source object to mutate the value of the property in place.

Without the `transform` function validation would fail due to the pattern not matching as the input contains leading and trailing whitespace, but by adding the transform function validation passes and the field value is sanitized at the same time.

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

### Standard Rules

Some standard rules for common validation requirements are accessible, you may wish to reference these rules or copy and modify them.

These rules must be required to be used: `require('async-validate/std-rules')`, see [std rules](https://github.com/freeformsystems/async-validate/blob/master/std-rules.js).

* `field`: Typical required field.
* `email`: Basic email validation rule using a pattern, note validating email addresses with a regular expression is [fraught with pitfalls](http://stackoverflow.com/questions/201323/using-a-regular-expression-to-validate-an-email-address/201378#201378), use this with caution.
* `url`: Simple http(s) URL rule.
* `hex`: Rule for hexadecimal color values with optional leading hash.

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

* `first`: Invoke callback when the first validation rule generates an error, no more validation rules are processed.
* `single`: Only ever return a single error, typically used in conjunction with `first` when a validation rule could generate multiple errors.
* `keys`: Specifies the keys on the source object to be validated. Use this option to validate fields in a determinate order or to validate a subset of the rules assigned to a schema.
* `parallel`: A boolean indicating that the validation should be executed in parallel.
* `field`: Field name for the root object, default is `source` when not specified.
* `rules`: Rules to apply to the root source object, may be an array or a single rule object.

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

#### Validator

```javascript
function Validator(opts)
```

Encapsulates the data associated with a validation rule and the value to be validated. Rule functions are invoked in the scope of a `Validator` instance which exposes the following public fields:

* `rule`: The validation rule in the schema descriptor.
* `value`: The value of the source object property being validated.
* `field`: The name of the field being validated.
* `source`: The source object passed to `validate()`.
* `options`: The options passed to `validate()`.
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

Validate a required field, typically invoked from a rule function, raises an error if a required field is not present.

##### pattern

```javascript
function pattern()
```

Validate using a regexp pattern, typically invoked from a rule function, raises an error if a value fails to match a rule regexp pattern.

##### type

```javascript
function type()
```

Validates the type of a value, typically invoked from a rule function, raises an error if a value is not of the correct type.

##### range

```javascript
function range()
```

Validates that a value falls within a given range or is of a specific length, typically invoked from a rule function, raises an error if a value is out of bounds.

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

## License

Everything is [MIT](http://en.wikipedia.org/wiki/MIT_License). Read the [license](https://github.com/freeformsystems/async-validate/blob/master/LICENSE) if you feel inclined.

Generated by [mdp(1)](https://github.com/freeformsystems/mdp).

[node]: http://nodejs.org
[npm]: http://www.npmjs.org
[mdp]: https://github.com/freeformsystems/mdp
[zephyr]: https://github.com/socialally/zephyr
