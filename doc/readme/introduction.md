Asynchronous validation for [node](http://nodejs.org) and the browser.

## Synopsis

None of the existing validation packages met the requirement to asynchronously validate user input. The [validator](https://github.com/chriso/node-validator) package is a helpful utility while [validate](https://github.com/eivindfjeldstad/validate) was closer as it took a more declarative approach but does not support asynchronous operations such as checking for existence of a database or validating that an email address already exists in a database.

So this package was created to allow for asynchronous validation of user input using a declarative schema based approach.
