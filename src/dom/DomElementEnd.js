/**
*
* Element End
*
*
**/

export function createDOMEndElementPrototype(domNodePrototype){

  // https://dom.spec.whatwg.org/#dom-node-nodetype
  Object.defineProperty(domNodePrototype, 'nodeType', {
    enumerable: true,
    value: -1
  });

  // https://dom.spec.whatwg.org/#dom-element-prefix
  Object.defineProperty(domNodePrototype, 'prefix', {
    enumerable: true,
    get: function(){
      var match = /^[^\s:]+:/.exec(this.s.slice(this.b + 2));
      return match ? match[0].slice(0,-1) : null;
    }
  });
  
  // https://dom.spec.whatwg.org/#dom-element-localname
  Object.defineProperty(domNodePrototype, 'localName', {
    enumerable: true,
    get: function(){
      return this.nodeName.split(':').pop();
    }
  });
  
  // https://dom.spec.whatwg.org/#dom-element-tagname
  Object.defineProperty(domNodePrototype, 'tagName', {
    enumerable: true,
    get: function(){
      return this.nodeName;
    }
  });

  Object.defineProperty(domNodePrototype, 'nodeName', {
    enumerable: true,
    get: function(){
      // 2: '</'.length
      return /^[^\s/>]+/.exec(this.s.slice(this.b + 2))[0];
    }
  });
  return domNodePrototype;
}
