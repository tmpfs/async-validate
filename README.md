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

```
var schema = require('async-validate');
var descriptor = {
  name: {type: "string", required: true}
}
var validator = new schema(descriptor);
validator.validate({name: "muji"}, function(errors, fields) {
  if(errors) {
    // validation failed, errors is an array of all errors
    // fields is keyed by property name
    return handleErrors(errors, fields);
  }
  // validation passed
});
```

### Required Fields

Add a `required` field to the descriptor to validate that the property exists.

### Fields Type

Add a `type` field to a descriptor to indicate that the field must be a `typeof` the specified type. 
