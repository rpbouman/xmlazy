# 🦥 xmlazy

> A library for streaming xml and lazy dom

## Features
- xml streaming (sax reader)
- lazy document building (DOM)

## How to use: Node

Using the reader:
```js
import * as xmlazy from 'xmlazy';

const reader = new xmlazy.SaxStringReader('<hello>world!</hello>');

let readerResult, lazyDomNode;
while (!(readerResult = reader.next()).done){

  lazyDomNode = readerResult.value;  
  switch (lazyDomNode.nodeType) {
  
    // do something interesting 
    
  }
  
}
```

Building a DOM document:

```js
import * as xmlazy from 'xmlazy';

const reader = new xmlazy.SaxStringReader('<hello>world!</hello>');
const domDocument = reader.buildDocument();
```

## How to use: Browser

Using the reader:

```
<script type="module">
  import * as xmlazy from '/dist/xmlazy.bundle.js';

  const reader = new xmlazy.SaxStringReader('<hello>world!</hello>');

  let readerResult, lazyDomNode;
  while (!(readerResult = reader.next()).done){

    lazyDomNode = readerResult.value;  
    switch (lazyDomNode.nodeType) {
    
      // do something interesting 
      
    }
    
  }
</script>
```

Building a DOM document:

```
<script type="module">
  import * as xmlazy from '/dist/xmlazy.bundle.js';

  const reader = new xmlazy.SaxStringReader('<hello>world!</hello>');
  const domDocument = reader.buildDocument();

</script>
```

## Developer environment requirements

To run this project, you will need:

- Node.js >= v10.5.0, use nvm - [install instructions](https://github.com/creationix/nvm#install-script)
- Yarn >= v1.7.0 - [install instructions ("Alternatives" tab)](https://yarnpkg.com/en/docs/install#alternatives-rc)

## Running tests

```sh
npm run test
```

## Running Samples

```sh
npm run serve
```

Then navigate to: [http://127.0.0.1:8080/samples/browser/index.html](http://127.0.0.1:8080/samples/browser/index.html)

## Acknowledgements

Project setup: [rollup-jest-boilerplate](https://github.com/algolia/rollup-jest-boilerplate)
