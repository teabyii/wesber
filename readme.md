# wesber

[![npm version](https://badge.fury.io/js/wesber.svg)](https://badge.fury.io/js/wesber)
[![Build Status](https://travis-ci.org/jsenjoy/wesber.svg?branch=master)](https://travis-ci.org/jsenjoy/wesber)
[![Coverage Status](https://coveralls.io/repos/jsenjoy/wesber/badge.svg?branch=master&service=github)](https://coveralls.io/github/jsenjoy/wesber?branch=master
)

A simple web resource dependencies finder and replacer.

Why make this? When we try to build web static files, we should trace all of the resources which the page depends. Then need a tool to help find the dependencies and replace their url (using hash as placeholder), which is **wesber**.

## Usage

### API

```js
const { css, html } = require('wesber')

css('style.css').then((result) => {
  ...
  // result = { file: ..., source: ..., replacer: ..., dependencies: [ ...] }
})

html('index.html').then((result) => {
  ... // result structure is the same
})
```

### Example

result:

```js
result = {
    file: '/Users/boom/Github/wesber/test/files/style.css',
    source: '.icon-a{\nbackground: url(foo.png)no-repeat;\n}\n',
    replacer: '.icon-a{\nbackground: url(#b0b5895c)no-repeat;\n}',
    dependencies: [
        {
            file: 'foo.png',
            hash: '#b0b5895c',
            entireUri: false,
            base64: false,
            path: '/Users/boom/Github/wesber/test/files/foo.png',
            exists: false
        }
    ]
}
```

## License

MIT
