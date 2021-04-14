import * as xmlazy from '../../src/xmlazy.js';

describe('Element open tag', () => {
  
  const attributes = `
    att1="value"
    p:att1="value"
    att2="value with a > inside"
    att2="value with multiple >> inside"
    att3='single quote'
    att4 ='one space before the = but not after'
    att5= 'one space after the = but not before'
    att6 = 'one space on eitherside of the ='
    att7   ='multiple spaces before the = but not after'
    att8=   'multiple spaces after the = but not before'
    att9   =   'multiple spaces on eitherside of the ='
    att10="double quoted value with one ' inside"
    att11='single quoted value with one " inside'
    att12="double quoted value with ' multiple ' inside"
    att13='single quoted value with " multiple " inside'
  `;

  describe('Without prefix', () => {
    const tagname = 'hello';
    const xml = `<${tagname}>`;
    let staxStringReader, staxResult, elementNode; 

    beforeAll(() => {
      staxStringReader = new xmlazy.StaxStringReader(xml);
      staxResult = staxStringReader.next();
      elementNode = staxResult.value;
    });

    it('Can parse an element open tag', () => {
      expect(staxResult.done).toBe(false);
      staxStringReader.next();
      expect(staxResult.done).toBe(true);
    });

    it('nodeType is 1', () => {
      expect(elementNode.nodeType).toBe(1);
    });

    it(`sourceXml is "${xml}"`, () => {
      expect(elementNode.sourceXml).toBe(xml);
    });

    it(`nodeValue is null`, () => {
      expect(elementNode.nodeValue).toBe(null);
    });

    it(`nodeName is "${tagname}"`, () => {
      expect(elementNode.nodeName).toBe(tagname);
    });

    it(`tagname is "${tagname}"`, () => {
      expect(elementNode.tagName).toBe(tagname);
    });

    it(`localname is "${tagname}"`, () => {
      expect(elementNode.localName).toBe(tagname);
    });

    it(`prefix is null`, () => {
      expect(elementNode.prefix).toBe(null);
    });

    it(`isSelfClosing is false`, () => {
      expect(elementNode.isSelfClosing).toBe(false);
    });

    it(`hasAttributes is false`, () => {
      expect(elementNode.hasAttributes()).toBe(false);
    });
    
    it(`hasChildnodes() is false"`, () => {
      expect(elementNode.hasChildNodes()).toBe(false);
    });
    
  });

  describe('Without prefix, with attributes', () => {
    const tagname = 'hello';
    const xml = `<${tagname} ${attributes}>`;
    let staxStringReader, staxResult, elementNode; 

    beforeAll(() => {
      staxStringReader = new xmlazy.StaxStringReader(xml);
      staxResult = staxStringReader.next();
      elementNode = staxResult.value;
    });

    it('Can parse an element open tag with attributes', () => {
      expect(staxResult.done).toBe(false);
      staxStringReader.next();
      expect(staxResult.done).toBe(true);
    });

    it(`hasAttributes is true`, () => {
      expect(elementNode.hasAttributes()).toBe(true);
    });

    it(`hasAttributes is true`, () => {
      expect(elementNode.hasAttributes()).toBe(true);
    });
    
    it(`sourceXml is "${xml}"`, () => {
      expect(elementNode.sourceXml).toBe(xml);
    });
        
  });

  describe('With prefix', () => {
    const prefix = 'greeting';
    const localName = 'hello'
    const tagname = `${prefix}:${localName}`;
    const xml = `<${tagname}>`;
    let staxStringReader, staxResult, elementNode;
    
    beforeAll(() => {
      staxStringReader = new xmlazy.StaxStringReader(xml);
      staxResult = staxStringReader.next();
      elementNode = staxResult.value;
    });
    
    it('Can parse an element open tag', () => {
      expect(staxResult.done).toBe(false);
      staxStringReader.next();
      expect(staxResult.done).toBe(true);
    });

    it('nodeType is 1', () => {
      expect(elementNode.nodeType).toBe(1);
    });

    it(`sourceXml is "${xml}"`, () => {
      expect(elementNode.sourceXml).toBe(xml);
    });

    it(`nodeValue is null`, () => {
      expect(elementNode.nodeValue).toBe(null);
    });

    it(`nodeName is "${tagname}"`, () => {
      expect(elementNode.nodeName).toBe(tagname);
    });

    it(`tagname is "${tagname}"`, () => {
      expect(elementNode.tagName).toBe(tagname);
    });

    it(`localname is "${localName}"`, () => {
      expect(elementNode.localName).toBe(localName);
    });

    it(`prefix is ${prefix}`, () => {
      expect(elementNode.prefix).toBe(prefix);
    });

    it(`isSelfClosing is false`, () => {
      expect(elementNode.isSelfClosing).toBe(false);
    });

    it(`hasAttributes is false`, () => {
      expect(elementNode.hasAttributes()).toBe(false);
    });
    
    it(`hasChildnodes() is false"`, () => {
      expect(elementNode.hasChildNodes()).toBe(false);
    });
    
  });

  describe('With prefix, with attributes', () => {
    const prefix = 'greeting';
    const localName = 'hello'
    const tagname = `${prefix}:${localName}`;
    const xml = `<${tagname} ${attributes}>`;
    let staxStringReader, staxResult, elementNode; 

    beforeAll(() => {
      staxStringReader = new xmlazy.StaxStringReader(xml);
      staxResult = staxStringReader.next();
      elementNode = staxResult.value;
    });

    it('Can parse an element open tag with attributes', () => {
      expect(staxResult.done).toBe(false);
      staxStringReader.next();
      expect(staxResult.done).toBe(true);
    });

    it(`hasAttributes is true`, () => {
      expect(elementNode.hasAttributes()).toBe(true);
    });
    
    it(`sourceXml is "${xml}"`, () => {
      expect(elementNode.sourceXml).toBe(xml);
    });
  });
  
  describe('ElementsByTagNameNS', () => {

    const listns = 'urn:corp:list';
    const empns = 'urn:corp:emp';
    const secns = 'urn:corp:sec';
    
    const xml = `
      <?xml version="1.0"?>
      <list:employeeList 
        xmlns:list="${listns}"
        xmlns:emp="${empns}"
        xmlns:sec="${secns}"
      >
        <list:personList>
          <emp:empID>E0000001</emp:empID>
          <sec:name>Sales</sec:name>
          <emp:name>John Smith</emp:name>
        </list:personList>
        <list:personList>
          <emp:empID>E0000002</emp:empID>
          <sec:name>Development</sec:name>
          <emp:name>Ichiro Tanaka</emp:name>
        </list:personList>
      </list:employeeList>
    `;
    let staxStringReader, doc, docElement; 

    beforeAll(() => {
      staxStringReader = new xmlazy.StaxStringReader(xml);
      doc = staxStringReader.buildDocument();
      docElement = doc.documentElement;
    });

    it('getElementsByTagNameNS(*, *)', () => {
      const descendants = docElement.getElementsByTagNameNS('*', '*');
      expect(descendants.length).toBe(8);
    });

    it('getElementsByTagNameNS(namespace, *)', () => {
      const descendants = docElement.getElementsByTagNameNS(listns, '*');
      expect(descendants.length).toBe(2);
    });

    it('getElementsByTagNameNS(*, name)', () => {
      const descendants = docElement.getElementsByTagNameNS('*', 'name');
      expect(descendants.length).toBe(4);
    });

    it('getElementsByTagNameNS(namespace, name)', () => {
      const descendants = docElement.getElementsByTagNameNS(secns, 'name');
      expect(descendants.length).toBe(2);
    });

  });
  
});
