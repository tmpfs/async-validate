Table of Contents
=================

* [Async Validate](#async-validate)
  * [Install](#install)
  * [Usage](#usage)
  * [Guide](#guide)
    * [Descriptor](#descriptor)
      * [Object Definition](#object-definition)
      * [Array Definition](#array-definition)
      * [Function Definition](#function-definition)
    * [Rules](#rules)
      * [Inline Rule](#inline-rule)
      * [Assigned Rule](#assigned-rule)
      * [Plugin Rule](#plugin-rule)
      * [Multiple Rules](#multiple-rules)
      * [Deep Rules](#deep-rules)
    * [Errors](#errors)
    * [Plugins](#plugins)
      * [Loading Plugins](#loading-plugins)
      * [Creating Plugins](#creating-plugins)
    * [Rule Properties](#rule-properties)
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
    * [API](#api)
      * [Schema](#schema)
        * [messages](#messages)
        * [validate](#validate)
        * [Schema.plugin](#schemaplugin)
        * [Schema.clone](#schemaclone)
      * [Reason](#reason)
      * [Rule](#rule)
        * [isRoot](#isroot)
        * [getReason](#getreason)
        * [raise](#raise)
        * [format](#format)
        * [validates](#validates)
        * [diff](#diff)
        * [required](#required)
        * [pattern](#pattern)
        * [range](#range)
  * [Developer](#developer)
    * [Test](#test)
    * [Spec](#spec)
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

Define validation rules, assign them to a schema using the necessary plugins and call validate:

```javascript
var Schema = require('..')
  , descriptor = {name: {type: "string", required: true}}
  , schema = new Schema(descriptor)
  , source = {};

Schema.plugin([
  require('../plugin/object'),
  require('../plugin/string'),
  require('../plugin/util')
]);

schema.validate(source, function(err, res) {
  if(err) {
    throw err; 
  }else if(res) {
    // validation failed, res.errors is an array of all errors
    // res.fields is a map keyed by field name with an array of
    // errors per field
    return console.dir(res.errors)
  }
  // validation passed
});
```

## Guide

### Descriptor

A descriptor is a collection of validation rules as a map of fields to rules, rules may be declared as an `object`, `array` or `function`.

#### Object Definition

```javascript
var descriptor = {
  name: {type: 'string', required: true}
}
```

#### Array Definition

You may declare an `array` to use multiple validation rules per field, see [multiple rules](#multiple-rules).

#### Function Definition

Use an inline function definition for application specific rules, see [inline rule](#inline-rule).

### Rules

```javascript
function rule(cb)
```

Rules are functions that perform validation of a value, they are invoked in the scope of a rule instance ([file](https://github.com/freeformsystems/async-validate/blob/master/lib/rule.js), [api docs](#rule)).

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
validator.validate({address: {}}, function(err, res) {
  // res.errors contains errors for name, street, city, zip
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
validator.validate({address: {}}, function(err, res) {
  // now res.errors only contains errors for name and street
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

Adding a reason allows associating an identifier with an error and optional meta data about the error.

### Plugins

Plugins are modules defining functions that allow users to only load functionality specific to the rule types being used which allows builds for the browser to be as lean as possible.

See [zephyr](https://github.com/socialally/zephyr) for plugin system documentation.

#### Loading Plugins

To load all plugins:

```javascript
require('async-validate/plugin/all');
```

It is preferable to only use plugins for the types you are using:

```javascript
var Schema = require('async-validate');
Schema.plugin([
  require('async-validate/plugin/util'),
  require('async-validate/plugin/array'),
  require('async-validate/plugin/boolean'),
  require('async-validate/plugin/number'),
  require('async-validate/plugin/string')
])
```

#### Creating Plugins

Static plugins are mapped to [type identifiers](#type-identifiers) and instance plugins may be used to extend [Rule](#rule) which is useful for sharing functionality across rule plugins, see the [util plugins](https://github.com/freeformsystems/async-validate/blob/master/plugin/util).

See [plugin rule](#plugin-rule) for an example and [plugin](https://github.com/freeformsystems/async-validate/blob/master/plugin) contains the plugins that ship with this package.

### Rule Properties

This section describes the recognised rule properties and their behaviour, if you are using an [assigned rule](#assigned-rule) or [plugin rule](#plugin-rule) you can define properties on the rule object and they are available to the rule function via `this`.

#### Type Identifier

The `type` property indicates the type of rule to use, a type corresponds to a plugin function and the plugin should have been loaded.

Recognised type values are:

* `string`: Must be of type `string`.
* `number`: Must be of type `number`.
* `boolean`: Must be of type `boolean`.
* `method`: Must be of type `function`.
* `null`: Must strictly equal `null`.
* `regexp`: Must be an instance of `RegExp` or a valid string regexp.
* `integer`: Must be of type `number` and an integer.
* `float`: Must be of type `number` and a floating point number.
* `array`: Must be an array as determined by `Array.isArray`.
* `object`: Must be of type `object` and not `Array.isArray`.
* `enum`: Value must exist in the `list`.
* `date`: Value must be valid as determined by `moment().isValid()`.

When the `object` plugin has been loaded the `type` field may be a function in which case the value must be an `instanceof` the function assigned to `type`.

#### Additional

When a rule is of the `object` type and `additional` is set to `false` an error is raised if the source object contains any properties not in the schema.

#### Fields

Rules of the `object` and `array` type may declare a `fields` object which declares a nested schema, see [deep rules](#deep-rules).

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

To validate a value from a list of possible values use the `enum` type with a `list` property containing the valid values for the field, for example:

```javascript
var descriptor = {
  role: {type: "enum", list: ['admin', 'user', 'guest']}
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

You may also use a function for the rule message, it is invoked in the scope of the [validator](#validator) and passed the original message and replacement parameters:

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
var Schema = require('async-validate')
  , messages = require('async-validate/messages')
  , descriptor = {name:{type: "string", required: true}}
  , schema;
messages.required = "%s is a required field";
schema = new Schema(descriptor, {messages: messages});
```

Potentially you may require the same schema validation rules for different languages, in which case duplicating the schema rules for each language does not make sense.

In this scenario you could just require your own messages file for the language and assign it to the schema:

```javascript
var Schema = require('async-validate')
  , messages = require('messages-es')
  , descriptor = {name:{type: "string", required: true}}
  , schema = new Schema(descriptor, {messages: messages});
```

If you are defining your own rule functions it is better practice to assign the message strings to a messages object and then access the messages via the `this.messages` property within the function.

### Transform

Sometimes it is necessary to transform a value before validation, possibly to coerce the value or to sanitize it in some way. To do this add a `transform` function to the validation rule. The property is transformed prior to validation and re-assigned to the source object to mutate the value of the property in place.

Without the `transform` function validation would fail due to the pattern not matching as the input contains leading and trailing whitespace, but by adding the transform function validation passes and the field value is sanitized at the same time.

```javascript
var Schema = require('..')
  , descriptor = {
    name: {
      type: "string",
      required: true, pattern: /^[a-z]+$/,
      transform: function(value) {
        return value.trim();
      }
    }
  }
  , schema = new Schema(descriptor)
  , source = {name: " user  "};

Schema.plugin([
  require('../plugin/object'),
  require('../plugin/string'),
  require('../plugin/util')
]);

schema.validate(source, function(err, res) {
  console.dir(source.name);
});
```

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

## Developer

### Test

Run the test specifications:

```
npm test
```

### Spec

Compile test specifications for the browser (open `test/index.html`):

```
npm run spec
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
