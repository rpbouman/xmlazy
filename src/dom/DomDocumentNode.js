/**
*
* Document
*
* https://dom.spec.whatwg.org/#interface-document
*
**/

export function createDOMDocumentPrototype(domNodePrototype){
  // https://dom.spec.whatwg.org/#dom-node-nodetype
  Object.defineProperty(domNodePrototype, 'nodeType', {
    enumerable: true,
    value: 9
  });
  // https://dom.spec.whatwg.org/#dom-node-nodename
  Object.defineProperty(domNodePrototype, 'nodeName', {
    enumerable: true,
    value: '#document'
  });
  // 
  Object.defineProperty(domNodePrototype, 'p', {
    value: null
  });
  // 
  Object.defineProperty(domNodePrototype, 'b', {
    value: 0
  });
  Object.defineProperty(domNodePrototype, 'e', {
    get: function(){
      return this.s.length;
    }
  });
  // https://dom.spec.whatwg.org/#dom-node-ownerdocument
  Object.defineProperty(domNodePrototype, 'ownerDocument', {
    enumerable: true,
    value: null
  });
  // https://dom.spec.whatwg.org/#dom-node-haschildnodes
  domNodePrototype.hasChildNodes = function() {
    return Boolean(this.n);
  };
  
  // https://dom.spec.whatwg.org/#dom-document-documentelement
  Object.defineProperty(domNodePrototype, 'docType', {
    enumerable: true,
    get: function(){
      var n = this;
      // eslint-disable-next-line no-cond-assign
      while (n = n.n){
        switch (n.nodeType) {
          case this.ELEMENT_NODE:
            return null;
          case this.DOCUMENT_TYPE_NODE:
            return n;
        }
      }
      return null;
    }
  });

  // https://dom.spec.whatwg.org/#dom-document-documentelement
  Object.defineProperty(domNodePrototype, 'documentElement', {
    enumerable: true,
    get: function(){
      var n = this;
      // eslint-disable-next-line no-cond-assign
      while (n = n.n){
        if (n.nodeType === this.ELEMENT_NODE) {
          return n;
        }
      }
      return null;
    }
  });

  // https://dom.spec.whatwg.org/#dom-node-lookupprefix
  domNodePrototype.lookupPrefix = function(namespaceUri){
    if (namespaceUri === null || namespaceUri === '') {
      return null;
    }
    var e = this.documentElement;
    if (e === null) {
      return null;
    }      
    return e.lookupPrefix(namespaceUri);
  };
  
  return domNodePrototype;
}
