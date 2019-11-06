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
    return this.p.lookupPrefix(namespaceUri);
  };
    
  return domNodePrototype;
}
