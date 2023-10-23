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
    writable: false,
    value: 9
  });
  // https://dom.spec.whatwg.org/#dom-node-nodename
  Object.defineProperty(domNodePrototype, 'nodeName', {
    enumerable: true,
    writable: false,
    value: '#document'
  });
  // 
  Object.defineProperty(domNodePrototype, 'p', {
    enumerable: false,
    writable: false,
    value: null
  });

  // 
  Object.defineProperty(domNodePrototype, 'b', {
    enumerable: false,
    writable: false,
    value: 0
  });
  
  Object.defineProperty(domNodePrototype, 'e', {
    enumerable: false,
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
  Object.defineProperty(domNodePrototype, 'hasChildNodes', {
    enumerable: true,
    writable: false,
    value: function() {
      return Boolean(this.n);
    }
  });
  
  // https://dom.spec.whatwg.org/#dom-document-doctype
  Object.defineProperty(domNodePrototype, 'doctype', {
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
          default:
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
  Object.defineProperty(domNodePrototype, 'lookupPrefix', {
    enumerable: true,
    writable: false,
    value: function(namespaceUri){
      if (namespaceUri === null || namespaceUri === '') {
        return null;
      }
      var e = this.documentElement;
      if (e === null) {
        return null;
      }      
      return e.lookupPrefix(namespaceUri);
    }
  });

  // https://dom.spec.whatwg.org/#dom-node-lookupnamespaceuri
  Object.defineProperty(domNodePrototype, 'lookupNamespaceURI', {
    enumerable: true,
    writable: false,
    value: function(pfx){
      var e = this.documentElement;
      if (e === null) {
        return null;
      }      
      return e.lookupNamespaceURI(pfx);
    }
  });

  // https://dom.spec.whatwg.org/#dom-node-isdefaultnamespace
  Object.defineProperty(domNodePrototype, 'isDefaultNamespace', {
    enumerable: true,
    writable: false,
    value: function(namespaceUri){
      var e = this.documentElement;
      if (e === null) {
        return namespaceUri === null || namespaceUri === '';
      }
      return e.isDefaultNamespace(namespaceUri);
    }
  });
  
  // https://dom.spec.whatwg.org/#dom-nonelementparentnode-getelementbyid
  Object.defineProperty(domNodePrototype, 'getElementById', {
    enumerable: true,
    writable: false,
    value: function(id){
      var n = this;
      // eslint-disable-next-line no-cond-assign
      while (n = n.n) {
        if (n.nodeType !== this.ELEMENT_NODE){
          continue;
        }
        var attribute, attributeIteratorResult, attributeIterator = n.getAttributeIterator();
        // eslint-disable-next-line no-cond-assign
        while (!(attributeIteratorResult = attributeIterator.next()).done) {
          attribute = attributeIteratorResult.value;
          if (attribute.name === 'id' && attribute.value === id){
            return n;
          }
        }
      }
      return null;
    }
  });

  Object.defineProperty(domNodePrototype, 'getElementsByTagName', {
    enumerable: true,
    writable: false,
    value: function(nodeName){
      var documentElement = this.documentElement;
      var nodes = documentElement.getElementsByTagName(nodeName);
      
      if (documentElement.nodeName === nodeName){
        nodes.a.unshift(documentElement);
      }
      return nodes;
    }
  });
  
  Object.defineProperty(domNodePrototype, 'getElementsByTagNameNS', {
    enumerable: true,
    writable: false,
    value: function(namespaceURI, localName){
      const wildcard = '*';
      if (namespaceURI === '') {
        namespaceURI = null;
      }
      var documentElement = this.documentElement;
      var nodes = documentElement.getElementsByTagNameNS(namespaceURI, localName);
      
      if (
        ( namespaceURI === wildcard ? true : documentElement.namespaceURI === namespaceURI) &&
        ( localName    === wildcard ? true : documentElement.localName    === localName)
      ){
        nodes.a.unshift(documentElement);
      }
      return nodes;
    }
  });
  
  return domNodePrototype;
}
