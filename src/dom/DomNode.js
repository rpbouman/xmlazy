const ELEMENT_END = -1;

const ELEMENT_NODE = 1;
const ATTRIBUTE_NODE = 2;
const TEXT_NODE = 3;
const CDATA_SECTION_NODE = 4;
const ENTITY_REFERENCE_NODE = 5;
const ENTITY_NODE = 6;
const PROCESSING_INSTRUCTION_NODE = 7;
const COMMENT_NODE = 8;
const DOCUMENT_NODE = 9;
const DOCUMENT_TYPE_NODE = 10;
const DOCUMENT_FRAGMENT_NODE = 11;
const NOTATION_NODE = 12;

/**
*
* NodeList
*
* https://dom.spec.whatwg.org/#nodelist
*
**/

var childNodeIterator = {};
Object.defineProperty(childNodeIterator, 'reset', {
  writable: false,
  enumerable: false,
  value: function(){
    if (this.r) {
      delete this.r.value;
      this.r.done = false;
    }
  }
});

Object.defineProperty(childNodeIterator, 'next', {
  writable: false,
  enumerable: true,
  value: function(){
    var p = this.p;
    var hasChildNodes = p.hasChildNodes();
    var r = this.r || (this.r = {done: !hasChildNodes});
    switch (p.nodeType){
      case ELEMENT_NODE:
      case DOCUMENT_NODE:
        if (hasChildNodes) {
          break;
        }
        // fall through
      default: 
        return r;
    }
    if (r.value) {
      var n = r.value;
      if (n.nodeType === ELEMENT_NODE) {
        if (n.isSelfClosing) {
          n = n.n;
          
          if (n.nodeType === ELEMENT_END){
            this.l = 0;
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
            case ELEMENT_END: 
              level -= 1;
              break;
            case ELEMENT_NODE:
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
          r.done = true;
        }
      }
      else {
        n = n.n;
        if (n){
          if (n.nodeType === ELEMENT_END){
            r.done = true;
          }
          else {
            r.value = n;
          }
        }
        else {
          r.done = true;
        }
      }
    }
    else {
      r.value = p.n;
    }
    return r;
  }
});

var childNodeList = {
  __proto__: childNodeIterator,  
};

Object.defineProperty(childNodeList, 'item', {
  enumerable: true,
  writable: false,
  value: function(index){
    if (typeof index !== 'number') {
      throw new TypeError('Argument should be a number.');
    }
    if (index < 0) {
      throw new RangeError('Index must not be less than zero.');
    }
    if (this.i > index){
      this.reset();
    }
    var result;
    // eslint-disable-next-line no-cond-assign
    while (!(result = this.next()).done){
      this.i += 1;
      if (this.i === index) {
        return result.value;
      }
    }
    throw new RangeError('Index exceeds length.');
  }
});

Object.defineProperty(childNodeList, 'length', {
  enumerable: true,
  get: function(){
    if (this.l === undefined) {
      var l = 0;
      // eslint-disable-next-line no-cond-assign
      while (!this.next().done){
        l += 1;
      }
      this.reset();
      this.l = l;
    }
    return this.l;
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
    value: ELEMENT_NODE
  });
  
  Object.defineProperty(o, 'ATTRIBUTE_NODE', {
    enumerable: true,
    value: ATTRIBUTE_NODE
  });
  
  Object.defineProperty(o, 'TEXT_NODE', {
    enumerable: true,
    value: TEXT_NODE
  });
  
  Object.defineProperty(o, 'CDATA_SECTION_NODE', {
    enumerable: true,
    value: CDATA_SECTION_NODE
  });
  
  Object.defineProperty(o, 'ENTITY_REFERENCE_NODE', {
    enumerable: true,
    value: ENTITY_REFERENCE_NODE
  });
  
  Object.defineProperty(o, 'ENTITY_NODE', {
    enumerable: true,
    value: ENTITY_NODE
  });

  Object.defineProperty(o, 'PROCESSING_INSTRUCTION_NODE', {
    enumerable: true,
    value: PROCESSING_INSTRUCTION_NODE
  });

  Object.defineProperty(o, 'COMMENT_NODE', {
    enumerable: true,
    value: COMMENT_NODE
  });

  Object.defineProperty(o, 'DOCUMENT_NODE', {
    enumerable: true,
    value: DOCUMENT_NODE
  });

  Object.defineProperty(o, 'DOCUMENT_TYPE_NODE', {
    enumerable: true,
    value: DOCUMENT_TYPE_NODE
  });

  Object.defineProperty(o, 'DOCUMENT_FRAGMENT_NODE', {
    enumerable: true,
    value: DOCUMENT_FRAGMENT_NODE
  });

  Object.defineProperty(o, 'NOTATION_NODE', {
    enumerable: true,
    value: NOTATION_NODE
  });

  Object.defineProperty(o, 'sourceXml', {
    get: function (){
      return this.s.slice(this.b, this.e);
    }
  });
  
  //TODO: implement this so as to return a normalized representation of this element.
  Object.defineProperty(o, 'toString', {
    enumerable: true,
    writable: false,
    value: function(){
      return this.sourceXml;
    }
  });

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
          case ELEMENT_NODE:
            if (p.hasChildNodes()) {
              break prev;
            }
            else {
              continue;
            }
          case DOCUMENT_NODE:
            break prev;
        }
      }
      return p;
    }
  });

  Object.defineProperty(o, 'getChildNodeIterator', {
    enumerable: false,
    writable: false,
    value: function(){
      return {
        __proto__: childNodeIterator,
        p: this,
        i: 0
      };
    }
  });

  Object.defineProperty(o, 'childNodes', {
    enumerable: true,
    get: function(){
      return {
        p: this,
        i: -1,
        __proto__: childNodeList
      };
    }
  });
    
  // https://dom.spec.whatwg.org/#dom-node-nodevalue
  Object.defineProperty(o, 'nodeValue', {
    enumerable: true,
    value: null,
    configurable: true
  });
  
  return o;
}
