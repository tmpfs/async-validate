## Developer

Clone the repository, install project and global dependencies ([mdp][], [jshint][] and [jscs][]):

```
npm i && npm i -g mdp jshint jscs
```

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

### Lint

Run the source tree through [jshint][] and [jscs][]:

```
npm run lint
```

### Browser

Create a standalone [browserify][] build:

```
npm run browser
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

### Example

Generate [EXAMPLE](/EXAMPLE.md) (requires [mdp][]):

```
npm run example 
```

### Readme

Generate the readme file (requires [mdp][]):

```
npm run readme
```
