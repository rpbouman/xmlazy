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
  Object.defineProperty(domNodePrototype, 'hasChildNodes', {
    enumerable: true,
    writable: false,
    value: function(){
      return false;
    }
  });

  // https://dom.spec.whatwg.org/#dom-node-firstchild
  Object.defineProperty(domNodePrototype, 'firstChild', {
    enumerable: true,
    writable: false,
    value: null
  });

  // https://dom.spec.whatwg.org/#dom-node-lastchild
  Object.defineProperty(domNodePrototype, 'lastChild', {
    enumerable: true,
    writable: false,
    value: null
  });

  // https://dom.spec.whatwg.org/#dom-node-lookupprefix
  Object.defineProperty(domNodePrototype, 'lookupPrefix', {
    enumerable: true,
    writable: false,
    value: function(namespaceUri){
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
    }
  });
    
  // https://dom.spec.whatwg.org/#dom-node-lookupnamespaceuri
  Object.defineProperty(domNodePrototype, 'lookupNamespaceURI', {
    enumerable: true,
    writable: false,
    value: function(pfx){
      if (this.X) {
        return this.X[pfx || ''];
      }
      return this.p.lookupNamespaceURI(pfx);
    }
  });
  

  // https://dom.spec.whatwg.org/#dom-node-isdefaultnamespace
  Object.defineProperty(domNodePrototype, 'isDefaultNamespace', {
    enumerable: true,
    writable: false,
    value: function(namespaceUri){
      if (namespaceUri === '') {
        namespaceUri = null;
      }
      if (this.X) {
        return this.X[''] === namespaceUri;
      }
      return this.p.isDefaultNamespace(namespaceUri);
    }
  });

  return domNodePrototype;
}
