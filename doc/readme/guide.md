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

See [plugins](/plugins) for the type plugins that ship with this module and [zephyr][] for documentation on the plugin system.

The [plugin fixture](/test/fixtures/plugin.js) and the [plugin test](/test/spec/plugin.js) provide an example of creating a type plugin.

### Type

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
