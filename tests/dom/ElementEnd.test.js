import * as xmlazy from '../../src/xmlazy.js';

describe('Element end tag', () => {

  describe('Without prefix', () => {
    const tagname = 'hello';
    let 
      saxStringReader, saxResult, 
      xml, elementEndNode
    ; 
    beforeAll(() => {
      xml = `</${tagname}>`;
      saxStringReader = new xmlazy.SaxStringReader(xml);
      saxResult = saxStringReader.next();
      elementEndNode = saxResult.value;
    });

    it('Can parse an element end tag', () => {
      expect(saxResult.done).toBe(false);
      saxStringReader.next();
      expect(saxResult.done).toBe(true);
    });

    it('nodeType is -1', () => {
      expect(elementEndNode.nodeType).toBe(-1);
    });

    it(`sourceXml is "${xml}"`, () => {
      expect(elementEndNode.sourceXml).toBe(xml);
    });

    it(`nodeValue is null`, () => {
      expect(elementEndNode.nodeValue).toBe(null);
    });

    it(`nodeName is "${tagname}"`, () => {
      expect(elementEndNode.nodeName).toBe(tagname);
    });

    it(`tagname is "${tagname}"`, () => {
      expect(elementEndNode.tagName).toBe(tagname);
    });

    it(`localname is "${tagname}"`, () => {
      expect(elementEndNode.localName).toBe(tagname);
    });

    it(`prefix is null`, () => {
      expect(elementEndNode.prefix).toBe(null);
    });

  });

  describe('With prefix', () => {
    const prefix = 'greeting';
    const localName = 'hello'
    const tagname = `${prefix}:${localName}`;
    let 
      saxStringReader, saxResult, 
      xml, elementEndNode
    ; 
    beforeAll(() => {
      xml = `</${tagname}>`;
      saxStringReader = new xmlazy.SaxStringReader(xml);
      saxResult = saxStringReader.next();
      elementEndNode = saxResult.value;
    });
    
    it('Can parse an element end tag', () => {
      expect(saxResult.done).toBe(false);
      saxStringReader.next();
      expect(saxResult.done).toBe(true);
    });

    it('nodeType is -1', () => {
      expect(elementEndNode.nodeType).toBe(-1);
    });

    it(`sourceXml is "${xml}"`, () => {
      expect(elementEndNode.sourceXml).toBe(xml);
    });

    it(`nodeValue is null`, () => {
      expect(elementEndNode.nodeValue).toBe(null);
    });

    it(`nodeName is "${tagname}"`, () => {
      expect(elementEndNode.nodeName).toBe(tagname);
    });

    it(`tagname is "${tagname}"`, () => {
      expect(elementEndNode.tagName).toBe(tagname);
    });

    it(`localname is "${localName}"`, () => {
      expect(elementEndNode.localName).toBe(localName);
    });

    it(`prefix is ${prefix}`, () => {
      expect(elementEndNode.prefix).toBe(prefix);
    });
    
  });

});
