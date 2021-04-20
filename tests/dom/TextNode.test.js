import * as xmlazy from '../../src/xmlazy.js';

describe('Text', () => {

  const text = 'world';
  let 
    staxStringReader, staxResult, 
    xml, elementNode, textNode
  ; 
  beforeAll(() => {
    xml = `<hello>${text}</hello>`;
    staxStringReader = new xmlazy.StaxStringReader(xml, {chainNodes: true});
    staxResult = staxStringReader.next();
    elementNode = staxResult.value;
    staxResult = staxStringReader.next();
    textNode = staxResult.value;
  });

  it('nodeType is 3', () => {
    expect(textNode.nodeType).toBe(3);
  });

  it(`sourceXml is "${text}"`, () => {
    expect(textNode.sourceXml).toBe(text);
  });

  it(`nodeValue is "${text}"`, () => {
    expect(textNode.nodeValue).toBe(text);
  });

  it(`data is "${text}"`, () => {
    expect(textNode.data).toBe(text);
  });

  it(`textContent is "${text}"`, () => {
    expect(textNode.textContent).toBe(textNode.data);
  });

  it(`nodeName is "#text"`, () => {
    expect(textNode.nodeName).toBe('#text');
  });

  it(`parentNode is element node`, () => {
    expect(textNode.parentNode).toBe(elementNode);
  });

  it(`hasChildNodes() is false`, () => {
    expect(textNode.hasChildNodes()).toBe(false);
  });

  it(`childNodes.length is 0`, () => {
    expect(textNode.childNodes.length).toEqual(0);
  });

  it(`firstChild must be null`, () => {
    expect(textNode.firstChild).toBe(null);
  });

  it(`lastChild must be null`, () => {
    expect(textNode.lastChild).toBe(null);
  });

  it(`lookupPrefix must be null`, () => {
    expect(textNode.lookupPrefix('')).toBe(null);
  });

  it(`data equals ${text}`, () => {
    expect(textNode.data).toBe(text);
  });

  describe('Text in namespace', () => {
    
    const text = 'world';
    const ns = 'urn.tmp:text';
    const pfx = 'txt';
    let 
      staxStringReader, staxResult, 
      xml, elementNode, textNode
    ;    
    beforeAll(() => {
      
      xml = `<hello xmlns:${pfx}="${ns}">${text}</hello>`;
      staxStringReader = new xmlazy.StaxStringReader(xml, {chainNodes: true});
      staxResult = staxStringReader.next();
      elementNode = staxResult.value;
      staxResult = staxStringReader.next();
      textNode = staxResult.value;
    });
  
    it(`lookupPrefix must be null`, () => {
      expect(textNode.lookupPrefix(ns)).toBe(pfx);
    });

  });
  
  describe('Text with named entities', () => {
    
    let 
      staxStringReader, staxResult, 
      xml, elementNode, textNode
    ;    
    beforeAll(() => {
      
    });
  
    it(`Should replace &lt;`, () => {
      xml = `<hello>less than: &lt;</hello>`;
      staxStringReader = new xmlazy.StaxStringReader(xml, {chainNodes: true});
      staxResult = staxStringReader.next();
      elementNode = staxResult.value;
      staxResult = staxStringReader.next();
      textNode = staxResult.value;
      expect(textNode.nodeValue).toBe('less than: <');
    });

    it(`Should replace &gt;`, () => {
      xml = `<hello>greather than: &gt;</hello>`;
      staxStringReader = new xmlazy.StaxStringReader(xml, {chainNodes: true});
      staxResult = staxStringReader.next();
      elementNode = staxResult.value;
      staxResult = staxStringReader.next();
      textNode = staxResult.value;
      expect(textNode.nodeValue).toBe('greather than: >');
    });

    it(`Should replace &apos;`, () => {
      xml = `<hello>apos: &apos;</hello>`;
      staxStringReader = new xmlazy.StaxStringReader(xml, {chainNodes: true});
      staxResult = staxStringReader.next();
      elementNode = staxResult.value;
      staxResult = staxStringReader.next();
      textNode = staxResult.value;
      expect(textNode.nodeValue).toBe("apos: '");
    });

    it(`Should replace &quot;`, () => {
      xml = `<hello>quot: &quot;</hello>`;
      staxStringReader = new xmlazy.StaxStringReader(xml, {chainNodes: true});
      staxResult = staxStringReader.next();
      elementNode = staxResult.value;
      staxResult = staxStringReader.next();
      textNode = staxResult.value;
      expect(textNode.nodeValue).toBe('quot: "');
    });

    it(`Should replace &amp;`, () => {
      xml = `<hello>amp: &amp;</hello>`;
      staxStringReader = new xmlazy.StaxStringReader(xml, {chainNodes: true});
      staxResult = staxStringReader.next();
      elementNode = staxResult.value;
      staxResult = staxStringReader.next();
      textNode = staxResult.value;
      expect(textNode.nodeValue).toBe('amp: &');
    });
    
  });

  describe('Text with decimal character entities', () => {
    
    let 
      staxStringReader, staxResult, 
      xml, elementNode, textNode
    ;    
    beforeAll(() => {
      
    });
  
    it(`Should replace &#65;`, () => {
      xml = `<hello>this is an A: &#65;</hello>`;
      staxStringReader = new xmlazy.StaxStringReader(xml, {chainNodes: true});
      staxResult = staxStringReader.next();
      elementNode = staxResult.value;
      staxResult = staxStringReader.next();
      textNode = staxResult.value;
      expect(textNode.nodeValue).toBe('this is an A: A');
    });

  });

  describe('Text with hexadecimal character entities', () => {
    
    let 
      staxStringReader, staxResult, 
      xml, elementNode, textNode
    ;    
    beforeAll(() => {
      
    });
  
    it(`Should replace &#x3B1;`, () => {
      xml = `<hello>this is an Alpha: &#x3B1;</hello>`;
      staxStringReader = new xmlazy.StaxStringReader(xml, {chainNodes: true});
      staxResult = staxStringReader.next();
      elementNode = staxResult.value;
      staxResult = staxStringReader.next();
      textNode = staxResult.value;
      expect(textNode.nodeValue).toBe('this is an Alpha: α');
    });

  });

});
