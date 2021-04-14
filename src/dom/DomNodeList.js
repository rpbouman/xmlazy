import { 
  ELEMENT_NODE,
  DOCUMENT_NODE,
  ELEMENT_END
} from './DomNodeTypes.js';
/**
*
* NodeList
*
* https://dom.spec.whatwg.org/#nodelist
*
**/

var childNodeIteratorPrototype = {};
Object.defineProperty(childNodeIteratorPrototype, 'reset', {
  writable: false,
  enumerable: false,
  value: function(){
    if (this.r) {
      delete this.r.value;
      this.r.done = false;
    }
  }
});

Object.defineProperty(childNodeIteratorPrototype, 'next', {
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

var childNodeListPrototype = {
  __proto__: childNodeIteratorPrototype,
};

function checkStaticNodelistIndex(index){
  if (typeof index !== 'number') {
    throw new TypeError('Argument should be a number.');
  }
  if (index < 0) {
    throw new RangeError('Index must not be less than zero.');
  }
}

Object.defineProperty(childNodeListPrototype, 'item', {
  enumerable: true,
  writable: false,
  value: function(index){
    checkStaticNodelistIndex(index);
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

Object.defineProperty(childNodeListPrototype, 'length', {
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

// array node listStyleType
var arrayNodeListPrototype = {};
Object.defineProperty(arrayNodeListPrototype, 'length', {
  enumerable: true,
  get: function(){
    return this.a.length;
  }
});

Object.defineProperty(arrayNodeListPrototype, 'item', {
  enumerable: true,
  value: function(index){
    checkStaticNodelistIndex(index);
    if (index > this.length){
      throw new RangeError('Index exceeds length.');
    }
    return this.a[index];
  }
});

function createArrayNodeList(a){
  return {
    a: a,
    __proto__: arrayNodeListPrototype
  };
}

export {
  childNodeIteratorPrototype,
  childNodeListPrototype,
  createArrayNodeList
};