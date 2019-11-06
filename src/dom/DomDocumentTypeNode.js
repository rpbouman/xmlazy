export function createDOMDocumentTypePrototype(domNodePrototype){
  
  // https://dom.spec.whatwg.org/#dom-node-nodetype
  Object.defineProperty(domNodePrototype, 'nodeType', {
    configurable: false,
    enumerable: true,
    value: 10
  });

  // https://dom.spec.whatwg.org/#concept-doctype-name
  Object.defineProperty(domNodePrototype, 'name', {
    enumerable: true,
    get: function(){
      var match = /^<!DOCTYPE\s+([^[\s>]+)[[\s>]/.exec(this.s.slice(this.b, this.e));
      if (match === null) {
        throw new Error('No name found');
      }
      return match[1];
    }
  });

  // https://dom.spec.whatwg.org/#dom-node-nodename
  Object.defineProperty(domNodePrototype, 'nodeName', {
    enumerable: true,
    get: function(){
      return this.name;
    }
  });

  // https://dom.spec.whatwg.org/#dom-documenttype-publicid
  Object.defineProperty(domNodePrototype, 'publicId', {
    enumerable: true,
    get: function(){
      var match = /^<!DOCTYPE\s+[^[\s>]+(\s+(SYSTEM|PUBLIC\s+("[^"]*"|'[^']*'))\s+("[^"]*"|'[^']*'))?[\s[>]+/.exec(this.s.slice(this.b, this.e));
      if (match === null) {
        throw new Error('Unexpected error getting public id.');
      }
      var publicId;
      if (match[3] && match[3].length) {
        publicId = match[3].slice(1, -1);
      }
      else {
        publicId = '';
      }
      return publicId;
    }
  });

  // https://dom.spec.whatwg.org/#dom-documenttype-systemid
  Object.defineProperty(domNodePrototype, 'systemId', {
    enumerable: true,
    get: function(){
      var match = /^<!DOCTYPE\s+[^\s[>]+(\s+(SYSTEM|PUBLIC\s+("[^"]*"|'[^']*'))\s+("[^"]*"|'[^']*'))?[\s[>]+/.exec(this.s.slice(this.b, this.e));
      if (match === null) {
        throw new Error('Unexpected error getting public id.');
      }
      var publicId;
      if (match[4] && match[4].length) {
        publicId = match[4].slice(1, -1);
      }
      else {
        publicId = '';
      }
      return publicId;
    }
  });
  
  domNodePrototype.hasChildNodes = function(){
    return false;
  };
    
  return domNodePrototype;
}
