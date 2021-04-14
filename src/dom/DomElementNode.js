var attributeRegexp = /(\s+)((([^\s=:x]|x[^m]|xm[^l]|xml[^n]|xmln[^s])[^=\s:]*|xmlns[^\s:=])(:[^\s:=]+)?)(\s*=\s*("[^"]*"|'[^']*'))/;
var attributeIteratorPrototype = {};

Object.defineProperty(attributeIteratorPrototype, 'reset', {
  enumerable: true,
  value: function(){
    delete this.p;
    delete this.s;
    delete this.r.v;
  }
})

Object.defineProperty(attributeIteratorPrototype, 'next', {
  enumerable: true,
  value: function(){
    var elementNode = this.E;
    var re, s;
    if (this.p) {
      re = this.p;
      s = this.s;
    }
    else {
      re = this.p = new RegExp(attributeRegexp.source, 'g');
      re.lastIndex = elementNode.b + 1 + elementNode.nodeName.length;
      s = this.s = elementNode.s.slice(0, elementNode.e);
    }
    var r = this.r || (this.r = {done: false});
    var match = re.exec(s);
    if (match === null) {
      r.done = true;
      // reset and free
      this.reset();
    }
    else {
      r.value = {
        b: match.index + match[1].length,
        e: match.index + match[0].length,
        p: elementNode,
        __proto__: elementNode.a
      };
    }
    return r;
  }
});

// https://dom.spec.whatwg.org/#namednodemap
var namedNodeMapPrototype = {
  __proto__: attributeIteratorPrototype
};

// https://dom.spec.whatwg.org/#dom-namednodemap-getnameditem
Object.defineProperty(namedNodeMapPrototype, 'getNamedItem', {
  enumerable: true,
  value: function(name){
    if (typeof name !== 'string') {
      throw new Error('Illegal argument: name must be of type string, got ${typeof name }');
    }
    var result, value;
    // eslint-disable-next-line no-cond-assign
    while (!(result = this.next()).done) {
      value = result.value;
      if (value.nodeName === name) {
        this.reset();
        return result.value;
      }
    }
    return null;
  }
});

// https://dom.spec.whatwg.org/#dom-namednodemap-item
Object.defineProperty(namedNodeMapPrototype, 'item', {
  enumerable: true,
  value: function(index){
    if (typeof index !== 'number') {
      throw new Error('Illegal argument: index must be of type number, got ${typeof index }');
    }
    else if (index < 0) {
      throw new Error('Illegal argument: index must not be less than zero.');
    }
    var i = 0;
    while (!this.next().done && index > i++) {
      // noop
    }
    var att = this.r.value;
    if (att === undefined) {
      return null;
    }
    this.reset();
    return att;
  }
});

// https://dom.spec.whatwg.org/#dom-namednodemap-length
Object.defineProperty(namedNodeMapPrototype, 'length', {
  enumerable: true,
  get: function(){
    var i = 0;
    while (!this.next().done) {
      i += 1;
    }
    return i;
  }
});

// https://dom.spec.whatwg.org/#dom-namednodemap-getnameditemns
Object.defineProperty(namedNodeMapPrototype, 'getNamedItemNS', {
  enumerable: true,
  value: function(namespace, localName){
    if (namespace && typeof namespace !== 'string') {
      throw new Error('Illegal argument: namespace must be of type string, got ${typeof namespace}');
    }
    if (typeof localName !== 'string') {
      throw new Error('Illegal argument: localName must be of type string, got ${typeof name }');
    }
    if (namespace === null) {
      namespace = '';
    }
    var result, value;
    // eslint-disable-next-line no-cond-assign
    while (!(result = this.next()).done) {
      value = result.value;
      if (value.localName === localName && value.namespaceURI === namespace) {
        this.reset();
        return result.value;
      }
    }
    return null;
  }
});

/**
*
* Element
*
* https://dom.spec.whatwg.org/#interface-element
*
**/
export function createDOMElementPrototype(domNodePrototype){
  // https://dom.spec.whatwg.org/#dom-node-nodetype
  Object.defineProperty(domNodePrototype, 'nodeType', {
    enumerable: true,
    value: 1
  });
  
  // https://dom.spec.whatwg.org/#dom-element-namespaceuri
  Object.defineProperty(domNodePrototype, 'namespaceURI', {
    enumerable: true,
    get: function(){
      return this.x[this.prefix || ''];
    }
  });
  
  // https://dom.spec.whatwg.org/#dom-element-prefix
  Object.defineProperty(domNodePrototype, 'prefix', {
    enumerable: true,
    get: function(){
      var match = /^[^\s:]+:/.exec(this.s.slice(this.b + 1));
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
  
  // https://dom.spec.whatwg.org/#dom-node-nodename
  Object.defineProperty(domNodePrototype, 'nodeName', {
    enumerable: true,
    get: function(){
      // 1: '<'.length
      return /^[^\s/>]+/.exec(this.s.slice(this.b + 1))[0];
    }
  });
    
  Object.defineProperty(domNodePrototype, 'isSelfClosing', {
    get: function(){
      return this.s.charAt(this.e - 2) === '/';
    }
  });
  
  // https://dom.spec.whatwg.org/#dom-node-haschildnodes
  Object.defineProperty(domNodePrototype, 'hasChildNodes', {
    enumerable: true,
    value: function(){
      return !(this.isSelfClosing || !this.n || this.n.nodeType === -1);
    }
  });

  Object.defineProperty(domNodePrototype, 'hasAttributes', {
    enumerable: true,
    value: function(){
      return this['@'] === undefined 
        ? /\s+([^x][^\s:=]*|x[^m][^\s:=]*|x|x(m(ln?)?)?|xmln[^s]|xmlns[^\s=:]+)(:[^s]+)?\s*=/.test(this.s.slice(this.b + 1, this.e - 1))
        : true
      ;
    }
  });
  
  Object.defineProperty(domNodePrototype, 'getAttributeIterator', {
    enumerable: true,
    value: function(){
      return {
        E: this,
        __proto__: attributeIteratorPrototype
      };
    }
  });
  
  // https://dom.spec.whatwg.org/#dom-element-attributes
  Object.defineProperty(domNodePrototype, 'attributes', {
    enumerable: true,
    get: function(){
      return {
        E: this,
        __proto__: namedNodeMapPrototype
      };
    }
  });
  
  // convenience method: this maps all attributes as attribute nodes keyed by qualified name
  Object.defineProperty(domNodePrototype, 'getAttributeNodeMap', {
    enumerable: true,
    value: function() {
      var map = {};
      var attribute, attributeIteratorResult, attributeIterator = this.getAttributeIterator();
      // eslint-disable-next-line no-cond-assign
      while (!(attributeIteratorResult = attributeIterator.next()).done) {
        attribute = attributeIteratorResult.value;
        map[attribute.name] = attribute;
      }
      return map;
    }
  });
  
  // https://dom.spec.whatwg.org/#dom-element-getattributenames
  // must return the qualified names of the attributes in this’s attribute list, in order, and a new list otherwise.
  // An attribute’s qualified name is its local name if its namespace prefix is null, and its namespace prefix, followed by ":", followed by its local name, otherwise.
  Object.defineProperty(domNodePrototype, 'getAttributeNames', {
    enumerable: true,
    value: function(){
      var attributeNames = [];
      var attributeResult, attributeNode, attributeIterator = this.getAttributeIterator();
      // eslint-disable-next-line no-cond-assign
      while (!(attributeResult = attributeIterator.next()).done) {
        attributeNode = attributeResult.value;
        attributeNames.push(attributeNode.nodeName);
      }
      return attributeNames;
    }
  });
  
  // https://dom.spec.whatwg.org/#dom-element-getattributenode
  Object.defineProperty(domNodePrototype, 'getAttributeNode', {
    enumerable: true,
    value: function(name){
      var attributeResult, attributeNode, attributeIterator = this.getAttributeIterator();
      // eslint-disable-next-line no-cond-assign
      while (!(attributeResult = attributeIterator.next()).done) {
        attributeNode = attributeResult.value;
        if (attributeNode.name === name) {
          return attributeNode;
        }
      }
      return null;
    }
  });
  
  // https://dom.spec.whatwg.org/#dom-element-getattribute
  Object.defineProperty(domNodePrototype, 'getAttribute', {
    enumerable: true,
    value: function(name){
      var attributeNode = this.getAttributeNode(name);
      if (attributeNode === null) {
        return null;
      }
      return attributeNode.nodeValue;
    }
  });
  
  // https://dom.spec.whatwg.org/#dom-element-getattributenodens
  Object.defineProperty(domNodePrototype, 'getAttributeNodeNS', {
    enumerable: true,
    value: function(namespace, localName){
      var attributeResult, attributeNode, attributeIterator = this.getAttributeIterator();
      // eslint-disable-next-line no-cond-assign
      while (!(attributeResult = attributeIterator.next()).done) {
        attributeNode = attributeResult.value;
        if (attributeNode.namespaceURI === namespace && attributeNode.localName === localName) {
          return attributeNode;
        }
      }
      return null;
    }
  });

  // https://dom.spec.whatwg.org/#dom-element-getattributens
  Object.defineProperty(domNodePrototype, 'getAttributeNS', {
    enumerable: true,
    value: function(namespace, localName){
      var attributeNode = this.getAttributeNodeNS(namespace, localName);
      if (attributeNode === null) {
        return null;
      }
      return attributeNode.nodeValue;
    }
  });
  
  // https://dom.spec.whatwg.org/#dom-node-lookupprefix
  Object.defineProperty(domNodePrototype, 'lookupPrefix', {
    enumerable: true,
    value: function(namespaceURI){
      if (namespaceURI === null || namespaceURI === '') {
        return null;
      }
      var x = this.x;
      for (var pfx in x){
        if (x[pfx] === namespaceURI) {
          return pfx === '' ? null : pfx;
        }
      }
      return null;
    }
  });

  // https://dom.spec.whatwg.org/#dom-node-lookupnamespaceuri
  Object.defineProperty(domNodePrototype, 'lookupNamespaceURI', {
    enumerable: true,
    value: function(pfx){
      return this.x[pfx || ''] || null;
    }
  });

  // https://dom.spec.whatwg.org/#dom-node-isdefaultnamespace
  Object.defineProperty(domNodePrototype, 'isDefaultNamespace', {
    enumerable: true,
    value: function(namespaceURI){
      return this.x[''] === namespaceURI;
    }
  });

  // https://dom.spec.whatwg.org/#dom-element-getelementsbytagnamens
  // The getElementsByTagNameNS(namespace, localName) method, when invoked, must return the list of elements with namespace namespace and local name localName for this.
  // The list of elements with namespace namespace and local name localName for a node root is the HTMLCollection returned by the following algorithm:
  // If namespace is the empty string, set it to null.
  // If both namespace and localName are "*" (U+002A), return a HTMLCollection rooted at root, whose filter matches descendant elements.
  // Otherwise, if namespace is "*" (U+002A), return a HTMLCollection rooted at root, whose filter matches descendant elements whose local name is localName.
  // Otherwise, if localName is "*" (U+002A), return a HTMLCollection rooted at root, whose filter matches descendant elements whose namespace is namespace.
  // Otherwise, return a HTMLCollection rooted at root, whose filter matches descendant elements whose namespace is namespace and local name is localName.
  Object.defineProperty(domNodePrototype, 'getElementsByTagNameNS', {
    enumerable: true,
    value: function(namespaceURI, localName){
      if (namespaceURI === '') {
        namespaceURI = null;
      }
      const wildcard = '*';
      const nodes = [];
      const ELEMENT_NODE = this.ELEMENT_NODE;
      const ELEMENT_END = this.ELEMENT_END;
      let n = this, level = 0;
      if (localName === wildcard && namespaceURI === wildcard) {
        // eslint-disable-next-line no-cond-assign
        loop: while (n = n.n) {
          switch (n.nodeType) {
            case ELEMENT_NODE:
              break;
            case ELEMENT_END:
              level -= 1;
              if (level === 0) {
                break loop;
              }
              // eslint-disable-next-line no-fallthrough
            default:
              continue;
          }
          if (!n.isSelfClosing) {
            level += 1;
          }
          nodes.push(n);
        }
      }
      else
      if (localName === wildcard){
        // eslint-disable-next-line no-cond-assign
        loop: while (n = n.n) {
          switch (n.nodeType) {
            case ELEMENT_NODE:
              break;
            case ELEMENT_END:
              level -= 1;
              if (level === 0) {
                break loop;
              }
              // eslint-disable-next-line no-fallthrough
            default:
              continue;
          }
          if (!n.isSelfClosing) {
            level += 1;
          }
          if (n.namespaceURI === namespaceURI) {
            nodes.push(n);
          }
        }
      }
      else
      if (namespaceURI === wildcard){
        // eslint-disable-next-line no-cond-assign
        loop: while (n = n.n) {
          switch (n.nodeType) {
            case ELEMENT_NODE:
              break;
            case ELEMENT_END:
              level -= 1;
              if (level === 0) {
                break loop;
              }
              // eslint-disable-next-line no-fallthrough
            default:
              continue;
          }
          if (!n.isSelfClosing) {
            level += 1;
          }
          if (n.localName === localName) {
            nodes.push(n);
          }
        }
      }
      else {
        // eslint-disable-next-line no-cond-assign
        loop: while (n = n.n) {
          switch (n.nodeType) {
            case ELEMENT_NODE:
              break;
            case ELEMENT_END:
              level -= 1;
              if (level === 0) {
                break loop;
              }
              // eslint-disable-next-line no-fallthrough
            default:
              continue;
          }
          if (!n.isSelfClosing) {
            level += 1;
          }
          if (n.localName === localName && n.namespaceURI === namespaceURI) {
            nodes.push(n);
          }
        }
      }
      return nodes;
    }
  });
  
  return domNodePrototype;
}
