/**
*
* Processing instruction
* 
* https://dom.spec.whatwg.org/#processinginstruction
*
*/
export function createDOMPIPrototype(domCharacterDataPrototype){

  // https://dom.spec.whatwg.org/#dom-node-nodetype
  Object.defineProperty(domCharacterDataPrototype, 'nodeType', {
    enumerable: true,
    value: 7
  });
  
  // https://dom.spec.whatwg.org/#dom-node-nodename
  Object.defineProperty(domCharacterDataPrototype, 'nodeName', {
    enumerable: true,
    get: function(){
      return this.target;
    }
  });
  
  // https://dom.spec.whatwg.org/#dom-characterdata-data
  Object.defineProperty(domCharacterDataPrototype, 'data', {
    enumerable: true,
    get: function(){
      throw new Error('Not implemented');
    }
  });
  
  // https://dom.spec.whatwg.org/#dom-processinginstruction-target
  Object.defineProperty(domCharacterDataPrototype, 'target', {
    enumerable: true,
    get: function(){
      // 2: '<?'.length
      return /^[^\s/?]+/.exec(this.s.slice(this.b + 2))[0];
    }
  });
  
  return domCharacterDataPrototype;
}
