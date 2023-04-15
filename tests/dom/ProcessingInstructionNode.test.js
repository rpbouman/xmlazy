import * as xmlazy from '../../src/xmlazy.js';

describe('Processing Instruction Node', () => {

  it(`PROCESSING_INSTRUCTION_NODE equals 7`, () => {
    expect(xmlazy.DomNodeTypes.PROCESSING_INSTRUCTION_NODE).toBe(7);
  });

  describe("Basic processing instruction node tests", () => {
    
    const target = 'xml';
    const content = 'version="1.0" encoding="UTF-8" standalone="yes"';
    const xmlDeclaration = `<?${target} ${content}?>`;
    const xml = `${xmlDeclaration}<documentElement/>`;
    const data = [
      {nodeType: xmlazy.DomNodeTypes.DOCUMENT_NODE, nodeName: '#document', nodeValue: null},
      {nodeType: xmlazy.DomNodeTypes.PROCESSING_INSTRUCTION_NODE, nodeName: target, nodeValue: content},
      {nodeType: xmlazy.DomNodeTypes.ELEMENT_NODE, nodeName: 'documentElement', nodeValue: null},
    ];
    
    const staxStringReader = new xmlazy.StaxStringReader(xml);
    
    let result;
    while (!(result = staxStringReader.next()).done) {
      const node = result.value;
      if (node.nodeType === xmlazy.DomNodeTypes.PROCESSING_INSTRUCTION_NODE) {
        const referenceNode = data[1];
        it(`nodeName equals ${target}`, ()=>{
          expect(node.nodeName).toBe(referenceNode.nodeName);
        });
        
        it(`nodeValue equals ${content}`, ()=>{
          expect(node.nodeValue).toBe(referenceNode.nodeValue);
        });
      }
      
    }
  });
});
