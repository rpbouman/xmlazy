/**
*
* NodeList
*
* https://dom.spec.whatwg.org/#nodelist
*
**/

var childNodeIterator = {};
childNodeIterator.reset = function(){
  if (this.r) {
    delete this.r.value;
    this.r.done = false;
  }
};

childNodeIterator.next = function(){
  var p = this.p;
  var hasChildNodes = p.hasChildNodes();
  var r = this.r || (this.r = {done: !hasChildNodes});
  switch (p.nodeType){
    case 1:
    case 9:
      if (hasChildNodes) {
        break;
      }
      // fall through
    default: 
      return r;
  }
  if (r.value) {
    var n = r.value;
    if (n.nodeType === 1) {
      if (n.isSelfClosing) {
        n = n.n;
        if (n.nodeType === -1){
          delete r.value;
          r.done = true;
        }
        else {
          r.value = n;
        }
        return r;
      }
      var level = 1;
      // eslint-disable-next-line no-cond-assign
      while ((n = n.n) && level > 0) {
        switch (n.nodeType){
          case -1: 
            level -= 1;
            break;
          case 1:
            if (!n.isSelfClosing){
              level += 1;
              break;
            }
            // fall through
          default:
        }        
      }
      if (level === 0 && n){
        r.value = n;        
      }
      else {
        delete r.value;
        r.done = true;
      }
    }
    else {
      n = n.n;
      if (n){
        if (n.nodeType === -1){
          delete r.value;
          r.done = true;
        }
        else {
          r.value = n;
        }
      }
      else {
        delete r.value;
        r.done = true;
      }
    }
  }
  else {
    r.value = p.n;
  }
  return r;
};

var childNodeList = {
  __proto__: childNodeIterator,  
};

childNodeList.item = function(index){
  if (typeof index !== 'number') {
    throw new TypeError('Argument should be a number.');
  }
  if (index < 0) {
    throw new RangeError('Index must not be less than zero.');
  }
  this.reset();
  var i = 0, result;
  // eslint-disable-next-line no-cond-assign
  while (!(result = this.next()).done){
    if (i === index) {
      return result.value;
    }
    i += 1;    
  }
  throw new RangeError('Index exceeds length.');
};

Object.defineProperty(childNodeList, 'length', {
  enumerable: true,
  get: function(){
    var length = 0;
    this.reset();
    while (!(this.next()).done) {
      length += 1;
    }
    return length;
  }
});

/**
*
* Node
*
* https://dom.spec.whatwg.org/#interface-node
*
**/

export function createDOMNodePrototype(o) {
  Object.defineProperty(o, 'ELEMENT_NODE', {
    enumerable: true,
    value: 1
  });
  
  Object.defineProperty(o, 'ATTRIBUTE_NODE', {
    enumerable: true,
    value: 2
  });
  
  Object.defineProperty(o, 'TEXT_NODE', {
    enumerable: true,
    value: 3
  });
  
  Object.defineProperty(o, 'CDATA_SECTION_NODE', {
    enumerable: true,
    value: 4
  });
  
  Object.defineProperty(o, 'ENTITY_REFERENCE_NODE', {
    enumerable: true,
    value: 5
  });
  
  Object.defineProperty(o, 'ENTITY_NODE', {
    enumerable: true,
    value: 6
  });

  Object.defineProperty(o, 'PROCESSING_INSTRUCTION_NODE', {
    enumerable: true,
    value: 7
  });

  Object.defineProperty(o, 'COMMENT_NODE', {
    enumerable: true,
    value: 8
  });

  Object.defineProperty(o, 'DOCUMENT_NODE', {
    enumerable: true,
    value: 9
  });

  Object.defineProperty(o, 'DOCUMENT_TYPE_NODE', {
    enumerable: true,
    value: 10
  });

  Object.defineProperty(o, 'DOCUMENT_FRAGMENT_NODE', {
    enumerable: true,
    value: 11
  });

  Object.defineProperty(o, 'NOTATION_NODE', {
    enumerable: true,
    value: 12
  });

  Object.defineProperty(o, 'sourceXml', {
    get: function (){
      return this.s.slice(this.b, this.e);
    }
  });
  
  //TODO: implement this so as to return a normalized representation of this element.
  o.toString = function(){
    return this.sourceXml;
  };

  // https://dom.spec.whatwg.org/#dom-node-nodetype
  // implemented in each subtype.

  // namespace.
  Object.defineProperty(o, 'x', {
    configurable: true,
    get: function(){
      if (!this.X){
        var n = this;
        // eslint-disable-next-line no-cond-assign
        while (n = n.parentNode) {
          if (n.X){
            this.X = n.X;
            break;
          }
        }
      }
      return this.X;
    }
  });

  // where this node ends. position in the source string.
  Object.defineProperty(o, 'e', {
    configurable: true,
    get: function(){
      return this.n ? this.n.b : (this.E || this.s.length);
    }
  });

  // https://dom.spec.whatwg.org/#dom-node-ownerdocument
  Object.defineProperty(o, 'ownerDocument', {
    configurable: true,
    enumerable: true,
    get: function(){
      return this.d;
    }
  });

  // https://dom.spec.whatwg.org/#dom-node-parentnode
  Object.defineProperty(o, 'parentNode', {
    configurable: true,
    enumerable: true,
    get: function(){
      var p = this;
      // eslint-disable-next-line no-cond-assign
      prev: while(p = p.p) {
        switch (p.nodeType) {
          case 1:
            if (p.hasChildNodes()) {
              break prev;
            }
            else {
              continue;
            }
          case 9:
            break prev;
        }
      }
      return p;
    }
  });

  o.getChildNodeIterator = function(){
    return {
      __proto__: childNodeIterator,
      p: this
    };
  };
  
  Object.defineProperty(o, 'childNodes', {
    enumerable: true,
    get: function(){
      return {
        p: this,
        __proto__: childNodeList
      };
    }
  });
  
  /*
  // https://dom.spec.whatwg.org/#dom-node-childnodes
  var emptyChildNodes = [];
  Object.defineProperty(o, 'childNodes', {
    enumerable: true,
    get: function(){
      switch (this.nodeType){
        case 1:
        case 9:
          if (this.hasChildNodes()) {
            break;
          }
          // falls through
        default: 
          return emptyChildNodes;
      }
      var n = this, level = 0, childNodes = [];
      // eslint-disable-next-line no-cond-assign
      while (level >= 0 && (n = n.n))  {
        if (level === 0 && n.nodeType > 0) {
          childNodes.push(n);
        }
        switch(n.nodeType) {
          case 1:
            if (!n.isSelfClosing){
              level += 1;
            }
            break;
          case -1:
            level -= 1;
        }
      }
      return childNodes;
    }
  });
  */
  
  // https://dom.spec.whatwg.org/#dom-node-nodevalue
  Object.defineProperty(o, 'nodeValue', {
    enumerable: true,
    value: null,
    configurable: true
  });
  
  return o;
}
