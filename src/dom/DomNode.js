import {
  ELEMENT_NODE,
  ATTRIBUTE_NODE,
  TEXT_NODE,
  CDATA_SECTION_NODE,
  ENTITY_REFERENCE_NODE,
  ENTITY_NODE,
  PROCESSING_INSTRUCTION_NODE,
  COMMENT_NODE,
  DOCUMENT_NODE,
  DOCUMENT_TYPE_NODE,
  DOCUMENT_FRAGMENT_NODE,
  NOTATION_NODE
} from './DomNodeTypes.js';
import { childNodeIteratorPrototype, childNodeListPrototype } from './DomNodeList.js';

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
        __proto__: childNodeIteratorPrototype,
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
        __proto__: childNodeListPrototype
      };
    }
  });

  // https://dom.spec.whatwg.org/#dom-node-nodevalue
  Object.defineProperty(o, 'nodeValue', {
    enumerable: true,
    value: null,
    configurable: true
  });

  Object.defineProperty(o, 'replaceEntities', {
    enumerable: false,
    value: function(text){
      if (typeof(text) !== 'string'){
        throw new Error(`Illegal argument type "${typeof(text)}" - expected "string".`);
      }
      return text.replace(/&(#(x([0-9A-Fa-f]+)|(\d+))|[^;]*);/g, function(match, entity, num, hexit, decit){
        if (num) {
          var n = parseInt(hexit || decit, hexit ? 16 : 10);
          if (!isNaN(n)){
            return String.fromCharCode(n);
          }
        }
        else {
          switch (entity) {
            case 'lt':
              return '<';
            case 'gt':
              return '>';
            case 'apos':
              return '\'';
            case 'quot':
              return '"';
            case 'amp':
              return '&';
          }
        }
        throw new Error(`Invalid character entity ${match}`);
      });
    }
  });

  return o;
}
