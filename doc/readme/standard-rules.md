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
