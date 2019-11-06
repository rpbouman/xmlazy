# 🦥 xmlazy

> A library for streaming xml and lazy dom

## Features
- xml streaming (sax reader)
- lazy document building (DOM)

## How to use

```js

const reader = new SaxStringReader('<hello>world!</hello>');

let readerResult, lazyDomNode;
while (!(readerResult = reader.next()).done){

  lazyDomNode = readerResult.value;  
  switch (lazyDomNode.nodeType) {
  
    // do something interesting 
    
  }
  
}
```


## Developer environment requirements

To run this project, you will need:

- Node.js >= v10.5.0, use nvm - [install instructions](https://github.com/creationix/nvm#install-script)
- Yarn >= v1.7.0 - [install instructions ("Alternatives" tab)](https://yarnpkg.com/en/docs/install#alternatives-rc)

## Running tests

```sh
yarn
yarn test
yarn test --watch
```

## Dev mode

When developing you can run:

```
yarn watch
```

This will regenerate the build files each time a source file is changed and serve on http://127.0.0.1:5000.

### Previewing umd build in the browser

If your package works in the browser, you can open `dev/index.html` to try it out.

## Publishing

```sh
npm publish
```

## Acknowledgements

Project setup: [rollup-jest-boilerplate](https://github.com/algolia/rollup-jest-boilerplate)
