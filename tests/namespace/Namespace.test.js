import * as xmlazy from '../../src/xmlazy.js';

describe('Namespace tests', () => {

  describe('Doc without namespace declarations', () => {
    const xml = `
      <root>
      </root>
    `;
    
    let elementNode;
    beforeAll(() => {
      const saxStringReader = new xmlazy.SaxStringReader(xml, {chainNodes: true});
      let saxReaderResult;
      saxReaderResult = saxStringReader.next();
      saxReaderResult = saxStringReader.next();
      elementNode = saxReaderResult.value;
    });

    it('Can correctly lookup the null prefix for the empty/null namespace', () => {    
      expect(elementNode.lookupPrefix('http://www.bananas.com/')).toBe(null);    
    });
    it('Can correctly return the null namespace for a prefix', () => {    
      expect(elementNode.lookupNamespaceURI('prefix')).toBe(null);    
    });
    it('Can correctly detect this is the default namespace', () => {    
      expect(elementNode.isDefaultNamespace(null)).toBe(true);    
    });
  });
  
  describe('Doc with one top-level unprefixed namespace declaration', () => {
    const xml = `
      <root xmlns="http://top.ns.com/">
      </root>
    `;
    
    let elementNode;
    beforeAll(() => {
      const saxStringReader = new xmlazy.SaxStringReader(xml, {chainNodes: true});
      let saxReaderResult;
      saxReaderResult = saxStringReader.next();
      saxReaderResult = saxStringReader.next();
      elementNode = saxReaderResult.value;
    });

    it('Can correctly lookup the null prefix for the "http://top.ns.com/" namespace', () => {    
      expect(elementNode.lookupPrefix('http://top.ns.com/')).toBe(null);    
    });
    it('Can correctly return the null namespace for a prefix', () => {    
      expect(elementNode.lookupNamespaceURI(null)).toBe('http://top.ns.com/');    
    });
    it('Can correctly detect that "http://top.ns.com/" is the default namespace', () => {    
      expect(elementNode.isDefaultNamespace('http://top.ns.com/')).toBe(true);    
    });
    it('Namespace declaration does not appear in attributes', () => {    
      expect(elementNode.attributes.length).toBe(0);    
    });
  });

  describe('Doc with one top-level prefixed namespace declaration', () => {
    const xml = `
      <root xmlns:pr="http://top.ns.com/">
      </root>
    `;
    
    let elementNode;
    beforeAll(() => {
      const saxStringReader = new xmlazy.SaxStringReader(xml, {chainNodes: true});
      let saxReaderResult;
      saxReaderResult = saxStringReader.next();
      saxReaderResult = saxStringReader.next();
      elementNode = saxReaderResult.value;
    });

    it('Can correctly lookup the "pr" prefix for the "http://top.ns.com/" namespace', () => {    
      expect(elementNode.lookupPrefix('http://top.ns.com/')).toBe('pr');    
    });
    it('Can correctly return the "http://top.ns.com/" namespace for the prefix "pr"', () => {    
      expect(elementNode.lookupNamespaceURI('pr')).toBe('http://top.ns.com/');    
    });
    it('Can correctly detect that "http://top.ns.com/" is not the default namespace', () => {    
      expect(elementNode.isDefaultNamespace('http://top.ns.com/')).toBe(false);    
    });
    it('Namespace declaration does not appear in attributes', () => {    
      expect(elementNode.attributes.length).toBe(0);    
    });
  });

  describe('Doc with one top-level prefixed namespace declaration and some attributes', () => {
    const xml = `
      <root 
        xmlns:pr="http://top.ns.com/" 
        att1="in the null namespace"
        pr:att2="in the http://top.ns.com/ namespace"
      >
      </root>
    `;
    
    let elementNode;
    beforeAll(() => {
      const saxStringReader = new xmlazy.SaxStringReader(xml, {chainNodes: true});
      let saxReaderResult;
      saxReaderResult = saxStringReader.next();
      saxReaderResult = saxStringReader.next();
      elementNode = saxReaderResult.value;
    });

    it('Namespace declaration does not appear in attributes', () => {    
      expect(elementNode.attributes.length).toBe(2);    
    });

    it('att1 is in the null namespace', () => {    
      expect(elementNode.attributes.item(0).namespaceURI).toBe(null);    
    });
    
    it('lookup prefix for null on att1 is null', () => {    
      expect(elementNode.attributes.item(0).lookupPrefix(null)).toBe(null);    
    });    
    
    it('lookup prefix for http://top.ns.com/ on att1 is pr', () => {    
      expect(elementNode.attributes.item(0).lookupPrefix('http://top.ns.com/')).toBe('pr');    
    });    

    it('pr:att2 is in the "http://top.ns.com/" namespace', () => {    
      expect(elementNode.attributes.item(1).namespaceURI).toBe("http://top.ns.com/");    
    });

    it('lookup prefix for null on pr:att2 is null', () => {    
      expect(elementNode.attributes.item(1).lookupPrefix(null)).toBe(null);    
    });    
    
    it('lookup prefix for http://top.ns.com/ on pr:att2 is pr', () => {    
      expect(elementNode.attributes.item(1).lookupPrefix('http://top.ns.com/')).toBe('pr');    
    });    
  });

  describe('Doc with one top-level prefixed namespace declaration and some attributes, namespace declaration at the end.', () => {
    const xml = `
      <root 
        att1="in the null namespace"
        pr:att2="in the http://top.ns.com/ namespace"
        xmlns:pr="http://top.ns.com/">
      </root>
    `;
    
    let elementNode;
    beforeAll(() => {
      const saxStringReader = new xmlazy.SaxStringReader(xml, {chainNodes: true});
      let saxReaderResult;
      saxReaderResult = saxStringReader.next();
      saxReaderResult = saxStringReader.next();
      elementNode = saxReaderResult.value;
    });

    it('Namespace declaration does not appear in attributes', () => {    
      expect(elementNode.attributes.length).toBe(2);    
    });

    it('att1 is in the null namespace', () => {    
      expect(elementNode.attributes.item(0).namespaceURI).toBe(null);    
    });

    it('pr:att2 is in the "http://top.ns.com/" namespace', () => {    
      expect(elementNode.attributes.item(1).namespaceURI).toBe("http://top.ns.com/");    
    });
  });

  describe('Doc with one unprefixed and one prefixed namespace declaration, one prefixed and one unprefixed attribute', () => {
    const xml = `
      <root 
        att1="in the null namespace"
        xmlns="http://default.ns.com/"
        pr:att2="in the http://prefixed.ns.com/ namespace"
        xmlns:pr="http://prefixed.ns.com/">
      </root>
    `;
    
    let elementNode;
    beforeAll(() => {
      const saxStringReader = new xmlazy.SaxStringReader(xml, {chainNodes: true});
      let saxReaderResult;
      saxReaderResult = saxStringReader.next();
      saxReaderResult = saxStringReader.next();
      elementNode = saxReaderResult.value;
    });

    it('Can correctly lookup the "pr" prefix for the "http://prefixed.ns.com/" namespace', () => {    
      expect(elementNode.lookupPrefix('http://prefixed.ns.com/')).toBe('pr');    
    });
    it('Can correctly return the "http://prefixed.ns.com/" namespace for the prefix "pr"', () => {    
      expect(elementNode.lookupNamespaceURI('pr')).toBe('http://prefixed.ns.com/');    
    });
    it('Can correctly detect that "http://prefixed.ns.com/" is not the default namespace', () => {    
      expect(elementNode.isDefaultNamespace('http://prefixed.ns.com/')).toBe(false);    
    });
    it('Can correctly lookup a null prefix for the "http://default.ns.com/" namespace', () => {    
      expect(elementNode.lookupPrefix('http://default.ns.com/')).toBe(null);    
    });
    it('Can correctly return the "http://default.ns.com/" namespace for the null prefix ', () => {    
      expect(elementNode.lookupNamespaceURI(null)).toBe('http://default.ns.com/');    
    });
    it('Can correctly return the "http://default.ns.com/" namespace for the empty string prefix ', () => {    
      expect(elementNode.lookupNamespaceURI('')).toBe('http://default.ns.com/');    
    });
    it('Can correctly detect that "http://default.ns.com/" is the default namespace', () => {    
      expect(elementNode.isDefaultNamespace('http://default.ns.com/')).toBe(true);    
    });

    it('element is in the http://default.ns.com/ namespace', () => {    
      expect(elementNode.namespaceURI).toBe('http://default.ns.com/');    
    });

    it('att1 is in the null namespace', () => {    
      expect(elementNode.attributes.item(0).namespaceURI).toBe(null);    
    });

    it('pr:att2 is in the "http://prefixed.ns.com/" namespace', () => {    
      expect(elementNode.attributes.item(1).namespaceURI).toBe("http://prefixed.ns.com/");    
    });
        
  });

  describe('Doc with one unprefixed and one prefixed namespace declaration with a unprefixed child element', () => {
    const xml = `
      <root 
        att1="in the null namespace"
        xmlns="http://default.ns.com/"
        pr:att2="in the http://prefixed.ns.com/ namespace"
        xmlns:pr="http://prefixed.ns.com/"
      >
      </root>
    `;
    
    let elementNode;
    beforeAll(() => {
      const saxStringReader = new xmlazy.SaxStringReader(xml, {chainNodes: true});
      let saxReaderResult;
      saxReaderResult = saxStringReader.next();
      saxReaderResult = saxStringReader.next();
      elementNode = saxReaderResult.value;
    });

  });
  
  describe('Doc with one unprefixed and one prefixed namespace declaration with a text content', () => {
    const xml = `
      <root 
        att1="in the null namespace"
        xmlns="http://default.ns.com/"
        pr:att2="in the http://prefixed.ns.com/ namespace"
        xmlns:pr="http://prefixed.ns.com/"
      >
        Text content
      </root>
    `;
    
    let documentNode, documentElement, textNode;
    beforeAll(() => {
      const saxStringReader = new xmlazy.SaxStringReader(xml, {chainNodes: true});
      documentNode = saxStringReader.buildDocument();
      documentElement = documentNode.documentElement;
      textNode = documentElement.childNodes.item(0);
    });

    it('lookup prefix for null on textnode is null', () => {    
      expect(textNode.lookupPrefix(null)).toBe(null);    
    });    
    
    it('lookup prefix for http://top.ns.com/ on att1 is pr', () => {    
      expect(textNode.lookupPrefix('http://top.ns.com/')).toBe('pr');    
    });    
  });
  

});
