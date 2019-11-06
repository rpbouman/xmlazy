/**
*
* CData 
*
* https://dom.spec.whatwg.org/#cdatasection
*
**/
export function createDOMCDataPrototype(domTextPrototype){

  // https://dom.spec.whatwg.org/#dom-node-nodetype
  Object.defineProperty(domTextPrototype, 'nodeType', {
    enumerable: true,
    value: 4
  });

  // https://dom.spec.whatwg.org/#dom-node-nodename
  Object.defineProperty(domTextPrototype, 'nodeName', {
    enumerable: true,
    value: '#cdata-section'
  });

  // https://dom.spec.whatwg.org/#dom-characterdata-data
  Object.defineProperty(domTextPrototype, 'data', {
    enumerable: true,
    get: function(){
      // 9: '<![CDATA['.length
      // 3: ']]>'.length
      return this.s.slice(this.b + 9, this.e -3);
    }
  });
  return domTextPrototype;
}
