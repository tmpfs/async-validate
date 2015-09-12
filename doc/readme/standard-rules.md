### Standard Rules

Some standard rules for common validation requirements are accessible, you may wish to reference these rules or copy and modify them.

These rules must be required to be used: `require('async-validate/std-rules')`, see [std rules](/std-rules.js).

* `field`: Typical required field.
* `email`: Basic email validation rule using a pattern, note validating email addresses with a regular expression is [fraught with pitfalls](http://stackoverflow.com/questions/201323/using-a-regular-expression-to-validate-an-email-address/201378#201378), use this with caution.
* `url`: Simple http(s) URL rule.
* `hex`: Rule for hexadecimal color values with optional leading hash.
