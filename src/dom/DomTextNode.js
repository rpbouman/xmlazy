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

  const namedEntities = {
    "lt": '<',
    "gt": '>',
    "apos": "'",
    "quot": '"',
    "apos": '&'
  };
  
  // https://dom.spec.whatwg.org/#dom-characterdata-data
  Object.defineProperty(domCharacterDataPrototype, 'data', {
    enumerable: true,
    get: function(){
      return this.s.slice(this.b, this.e)
      .replace(/&((lt|gt|apos|quot|amp)|#(x([0-9A-Fa-f]+)|(\d+)));/g, 
      function(match, entity, name, num, hexit, decit){
        var text;
        if (name !== undefined){
          text = namedEntities[name];
          if (text === undefined){
            throw new Error(`Encountered illegal entity reference ${name}`);
          }
        }
        else {
          var i = parseInt(hexit || decit, hexit ? 16 : 10);
          text = String.fromCharCode(i);
        }
        return text;
      });
    }
  });
  return domCharacterDataPrototype;
}
