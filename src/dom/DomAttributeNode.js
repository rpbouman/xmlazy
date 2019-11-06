/**
*
* Attr
*
* https://dom.spec.whatwg.org/#attr
**/
export function createDOMAttributePrototype(domNodePrototype){
  // https://dom.spec.whatwg.org/#dom-node-nodetype
  Object.defineProperty(domNodePrototype, 'nodeType', {
    enumerable: true,
    value: 2
  });
  
  // https://dom.spec.whatwg.org/#dom-node-parentnode
  Object.defineProperty(domNodePrototype, 'parentNode', {
    enumerable: true,
    value: null
  });

  // https://dom.spec.whatwg.org/#dom-attr-ownerelement
  Object.defineProperty(domNodePrototype, 'ownerElement', {
    enumerable: true,
    get: function(){
      return this.p;
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
  
  // https://dom.spec.whatwg.org/#dom-attr-specified
  Object.defineProperty(domNodePrototype, 'specified', {
    enumerable: true,
    value: true
  });

  // https://dom.spec.whatwg.org/#concept-attribute-qualified-name
  Object.defineProperty(domNodePrototype, 'localName', {
    enumerable: true,
    get: function(){
      return /^([^\s=:]+:)?([^\s=]+)/.exec(this.s.slice(this.b))[2];
    }
  });

  // https://dom.spec.whatwg.org/#concept-attribute-qualified-name
  Object.defineProperty(domNodePrototype, 'prefix', {
    enumerable: true,
    get: function(){
      var match = /^[^\s=:]+:/.exec(this.s.slice(this.b));
      return match ? match[0].slice(0,-1) : null;
    }
  });

  // https://dom.spec.whatwg.org/#concept-attribute-qualified-name
  Object.defineProperty(domNodePrototype, 'nodeName', {
    enumerable: true,
    get: function(){
      return /^[^\s=]+/.exec(this.s.slice(this.b))[0];
    }
  });

  // https://dom.spec.whatwg.org/#concept-attribute-qualified-name
  Object.defineProperty(domNodePrototype, 'name', {
    enumerable: true,
    get: function(){
      return this.nodeName;
    }
  });

  // https://dom.spec.whatwg.org/#dom-attr-namespaceuri
  Object.defineProperty(domNodePrototype, 'namespaceURI', {
    enumerable: true,
    get: function(){
      var prefix = this.prefix;
      // note - attribute namespace is resolved differently than that of elements.
      // attributes have to be explicitly prefixed.
      // unprefixed attributes are in the null namespace.
      // (unprefixed attributes are in the global namespaced (the one that is not prefixed)
      return prefix ? this.ownerElement.x[prefix] : null;
    }
  });
  
  // https://dom.spec.whatwg.org/#dom-attr-value
  Object.defineProperty(domNodePrototype, 'value', {
    enumerable: true,
    get: function(){
      return /'[^']*'|"[^"]*"/.exec(this.s.slice(this.b))[0].slice(1, -1);
    }
  });

  // https://dom.spec.whatwg.org/#dom-node-nodevalue
  Object.defineProperty(domNodePrototype, 'nodeValue', {
    enumerable: true,
    get: function(){
      return this.value;
    }
  });

  // https://dom.spec.whatwg.org/#dom-node-textcontent
  Object.defineProperty(domNodePrototype, 'textContent', {
    enumerable: true,
    get: function(){
      return this.value;
    }
  });

  // https://dom.spec.whatwg.org/#dom-node-lookupprefix
  domNodePrototype.lookupPrefix = function(namespaceUri){
    return this.p.lookupPrefix(namespaceUri);
  };

  return domNodePrototype;
}
