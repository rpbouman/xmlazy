export function createDOMCharacterDataPrototype(domNodePrototype){
  
  // https://dom.spec.whatwg.org/#dom-node-nodevalue
  Object.defineProperty(domNodePrototype, 'nodeValue', {
    enumerable: true,
    get: function(){
      return this.data;
    }
  });
  
  // https://dom.spec.whatwg.org/#dom-node-textcontent
  Object.defineProperty(domNodePrototype, 'textContent', {
    enumerable: true,
    get: function(){
      return this.data;
    }
  });
  
  // https://dom.spec.whatwg.org/#dom-node-haschildnodes
  domNodePrototype.hasChildNodes = function(){
    return false;
  };

  // https://dom.spec.whatwg.org/#dom-node-firstchild
  Object.defineProperty(domNodePrototype, 'firstChild', {
    enumerable: true,
    value: null
  });

  // https://dom.spec.whatwg.org/#dom-node-lastchild
  Object.defineProperty(domNodePrototype, 'lastChild', {
    enumerable: true,
    value: null
  });

  // https://dom.spec.whatwg.org/#dom-node-lookupprefix
  domNodePrototype.lookupPrefix = function(namespaceUri){
    if (this.X) {
      if (namespaceUri === null || namespaceUri === '') {
        return null;
      }
      var x = this.x;
      for (var pfx in x){
        if (x[pfx] === namespaceUri) {
          return pfx === '' ? null : pfx;
        }
      }
    }
    return this.p.lookupPrefix(namespaceUri);
  };
    
  // https://dom.spec.whatwg.org/#dom-node-lookupnamespaceuri
  domNodePrototype.lookupNamespaceURI = function(pfx){
    if (this.X) {
      return this.X[pfx || ''];
    }
    return this.p.lookupNamespaceURI(pfx);
  };

  // https://dom.spec.whatwg.org/#dom-node-isdefaultnamespace
  domNodePrototype.isDefaultNamespace = function(namespaceUri){
    if (this.X) {
      return this.X[''] === namespaceUri;
    }
    return this.p.isDefaultNamespace(namespaceUri);
  };

  return domNodePrototype;
}
