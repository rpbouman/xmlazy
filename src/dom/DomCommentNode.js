/**
*
* Comment
* 
* https://dom.spec.whatwg.org/#interface-comment
*/

export function createDOMCommentPrototype(domCharacterDataPrototype){

  // https://dom.spec.whatwg.org/#dom-node-nodetype
  Object.defineProperty(domCharacterDataPrototype, 'nodeType', {
    enumerable: true,
    value: 8
  });

  // https://dom.spec.whatwg.org/#dom-node-nodename
  Object.defineProperty(domCharacterDataPrototype, 'nodeName', {
    enumerable: true,
    value: '#comment'
  });

  // https://dom.spec.whatwg.org/#dom-characterdata-data
  Object.defineProperty(domCharacterDataPrototype, 'data', {
    enumerable: true,
    get: function(){
      // 4: '<!--'.length
      // 3: '-->'.length
      return this.s.slice(this.b + 4, this.e -3);
    }
  });
  return domCharacterDataPrototype;
}
