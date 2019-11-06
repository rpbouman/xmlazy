var attributeRegexp = /(\s+)((([^\s=:x]|x[^m]|xm[^l]|xml[^n]|xmln[^s])[^=\s:]*|xmlns[^\s:=])(:[^\s:=]+)?)(\s*=\s*("[^"]*"|'[^']*'))/;
var attributeIteratorPrototype = {};

attributeIteratorPrototype.reset = function(){
  delete this.p;
  delete this.s;
  delete this.r.v;
};

attributeIteratorPrototype.next = function(){
  var elementNode = this.E;
  var re;
  if (this.p) {
    re = this.p; 
  }
  else {
    re = this.p = new RegExp(attributeRegexp.source, 'g');
    re.lastIndex = elementNode.b + 1 + elementNode.nodeName.length;
  }
  var s = elementNode.s;
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
};

// https://dom.spec.whatwg.org/#namednodemap
var namedNodeMapPrototype = {
  __proto__: attributeIteratorPrototype
};

// https://dom.spec.whatwg.org/#dom-namednodemap-getnameditem
namedNodeMapPrototype.getNamedItem = function(name){
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
};

// https://dom.spec.whatwg.org/#dom-namednodemap-item
namedNodeMapPrototype.item = function(index){
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
};

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
namedNodeMapPrototype.getNamedItemNS = function(namespace, localName){
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
};

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
  domNodePrototype.hasChildNodes = function(){
    return !(this.isSelfClosing || !this.n || this.n.nodeType === -1);
  };

  domNodePrototype.hasAttributes = function(){
    return this['@'] === undefined 
      ? /\s+([^x][^\s:=]*|x[^m][^\s:=]*|x|x(m(ln?)?)?|xmln[^s]|xmlns[^\s=:]+)(:[^s]+)?\s*=/.test(this.s.slice(this.b + 1, this.e - 1))
      : true
    ;
  };
  
  domNodePrototype.getAttributeIterator = function(){
    return {
      E: this,
      __proto__: attributeIteratorPrototype
    };
  };
  
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
  domNodePrototype.getAttributeNodeMap = function() {
    var map = {};
    var attribute, attributeIteratorResult, attributeIterator = this.getAttributeIterator();
    // eslint-disable-next-line no-cond-assign
    while (!(attributeIteratorResult = attributeIterator.next()).done) {
      attribute = attributeIteratorResult.value;
      map[attribute.name] = attribute;
    }
    return map;
  };  
  
  // https://dom.spec.whatwg.org/#dom-element-getattributenode
  domNodePrototype.getAttributeNode = function(name){
    var attributeResult, attributeNode, attributeIterator = this.getAttributeIterator();
    // eslint-disable-next-line no-cond-assign
    while (!(attributeResult = attributeIterator.next()).done) {
      attributeNode = attributeResult.value;
      if (attributeNode.name === name) {
        return attributeNode;
      }
    }
    return null;
  };
  
  // https://dom.spec.whatwg.org/#dom-element-getattribute
  domNodePrototype.getAttribute = function(name){
    var attributeNode = this.getAttributeNode(name);
    if (attributeNode === null) {
      return null;
    }
    return attributeNode.nodeValue;
  };
  
  // https://dom.spec.whatwg.org/#dom-element-getattributenodens
  domNodePrototype.getAttributeNodeNS = function(namespace, localName){
    var attributeResult, attributeNode, attributeIterator = this.getAttributeIterator();
    // eslint-disable-next-line no-cond-assign
    while (!(attributeResult = attributeIterator.next()).done) {
      attributeNode = attributeResult.value;
      if (attributeNode.namespaceURI === namespace && attributeNode.localName === localName) {
        return attributeNode;
      }
    }
    return null;
  };

  // https://dom.spec.whatwg.org/#dom-element-getattributens
  domNodePrototype.getAttributeNS = function(namespace, localName){
    var attributeNode = this.getAttributeNodeNS(namespace, localName);
    if (attributeNode === null) {
      return null;
    }
    return attributeNode.nodeValue;
  };
  
  // https://dom.spec.whatwg.org/#dom-node-lookupprefix
  domNodePrototype.lookupPrefix = function(namespaceUri){
    if (namespaceUri === null || namespaceUri === '') {
      return null;
    }
    var x = this.x;
    for (var pfx in x){
      if (x[pfx] === namespaceUri) {
        return pfx === '' ? null : pfx;
      }
    }
    return null;
  };

  return domNodePrototype;
}
