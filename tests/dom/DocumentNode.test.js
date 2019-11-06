import * as xmlazy from '../../src/xmlazy.js';

describe('Document Node', () => {

  const tagname = 'hello';
  const xml = `<${tagname}>`;
  let saxStringReader, saxResult, documentNode, elementNode;
  
  beforeAll(() => {
    saxStringReader = new xmlazy.SaxStringReader(xml);
    documentNode = saxStringReader.buildDocument();
  });

  describe('Basic doc node tests', () =>{
    it('nodeType is 9', () => {
      expect(documentNode.nodeType).toBe(9);
    });

    it(`sourceXml is "${xml}"`, () => {
      expect(documentNode.sourceXml).toBe(xml);
    });

    it(`nodeName is "#document"`, () => {
      expect(documentNode.nodeName).toBe('#document');
    });
  });

  describe('DocumentElement tests', () => {
    it(`has a documentElement"`, () => {
      const elementNode = documentNode.documentElement;
      expect(elementNode.nodeType).toBe(1);
      expect(elementNode.nodeName).toBe(tagname);
    });

    it(`is ownerDocument of documentElement"`, () => {
      const elementNode = documentNode.documentElement
      expect(documentNode).toBe(elementNode.ownerDocument);
    });

    it(`hasChildnodes() is true"`, () => {
      expect(documentNode.hasChildNodes()).toBe(true);
    });

    it(`childNodes.length is 1`, () => {
      const childNodes = documentNode.childNodes;
      expect(childNodes.length).toBe(1);
    });

    it(`childnode is the documentElement"`, () => {
      const childNodes = documentNode.childNodes;
      expect(childNodes.item(0)).toBe(documentNode.documentElement);
    });

  });
  
});
