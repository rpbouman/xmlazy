import * as xmlazy from '../../src/xmlazy.js';

describe('Document Type Node', () => {

  describe("Basic doctype node tets", () => {
    const docTypeXml = '<!DOCTYPE greeting SYSTEM "hello.dtd">'; 
    const xml = `<?xml version="1.0"?>
      ${docTypeXml}
      <greeting>Hello, world!</greeting>
    `;
    let staxStringReader, staxResult, documentNode, docTypeNode;
    
    beforeAll(() => {
      staxStringReader = new xmlazy.StaxStringReader(xml);
      documentNode = staxStringReader.buildDocument();
      docTypeNode = documentNode.docType;
    });

    describe('Basic doc type node tests', () =>{
      it('nodeType is 10', () => {
        expect(docTypeNode.nodeType).toBe(10);
      });

      it('name is "greeting"', () => {
        expect(docTypeNode.name).toBe("greeting");
      });

      it('publicId is ""', () => {
        expect(docTypeNode.publicId).toBe("");
      });

      it('systemId is "hello.dtd"', () => {
        expect(docTypeNode.systemId).toBe("hello.dtd");
      });

      it(`sourceXml is "hello.dtd"`, () => {
        expect(docTypeNode.sourceXml).toBe(docTypeXml);
      });

      it('hasChildNodes() is false', () => {
        expect(docTypeNode.hasChildNodes()).toBe(false);
      });

      it('childNodes.length is 0', () => {
        expect(docTypeNode.childNodes.length).toBe(0);
      });

    });
    
  });
});
