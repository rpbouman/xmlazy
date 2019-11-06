/**
*
* Text 
*
* https://dom.spec.whatwg.org/#text
*
**/
export function createDOMTextPrototype(domCharacterDataPrototype){

  // https://dom.spec.whatwg.org/#dom-node-nodetype
  Object.defineProperty(domCharacterDataPrototype, 'nodeType', {
    enumerable: true,
    value: 3
  });

  // https://dom.spec.whatwg.org/#dom-node-nodename
  Object.defineProperty(domCharacterDataPrototype, 'nodeName', {
    enumerable: true,
    value: '#text'
  });
  
  // https://dom.spec.whatwg.org/#dom-characterdata-data
  Object.defineProperty(domCharacterDataPrototype, 'data', {
    enumerable: true,
    get: function(){
      return this.s.slice(this.b, this.e);
    }
  });
  return domCharacterDataPrototype;
}
