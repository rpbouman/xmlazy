import * as xmlazy from '../../src/xmlazy.js';

describe('CData Section', () => {

  const text = 'world';
  const cdata = `<![CDATA[${text}]]>`;
  const ns1 = 'urn.corp:tmp1';
  const ns2 = 'urn.corp:tmp2';
  const pfx = 'x';
  let 
    staxStringReader, staxResult, 
    xml, elementNode, cdataSectionNode, cdataSectionNode2
  ; 
  beforeAll(() => {
    xml = `<hello>${cdata}<${pfx}:world xmlns="${ns1}" xmlns:${pfx}="${ns2}"><![CDATA[world]]></${pfx}:world></hello>`;
    staxStringReader = new xmlazy.StaxStringReader(xml, {chainNodes: true});
    staxResult = staxStringReader.next();
    elementNode = staxResult.value;
    staxResult = staxStringReader.next();
    cdataSectionNode = staxResult.value;
    staxResult = staxStringReader.next();
    staxResult = staxStringReader.next();
    cdataSectionNode2 = staxResult.value
  });

  it('nodeType is 4', () => {
    expect(cdataSectionNode.nodeType).toBe(4);
  });

  it(`sourceXml is "${cdata}"`, () => {
    expect(cdataSectionNode.sourceXml).toBe(cdata);
  });

  it(`nodeValue is "${text}"`, () => {
    expect(cdataSectionNode.nodeValue).toBe(text);
  });

  it(`data is "${text}"`, () => {
    expect(cdataSectionNode.data).toBe(text);
  });

  it(`textContent is "${text}"`, () => {
    expect(cdataSectionNode.textContent).toBe(cdataSectionNode.data);
  });

  it(`nodeName is "#cdata-section"`, () => {
    expect(cdataSectionNode.nodeName).toBe('#cdata-section');
  });

  it(`parentNode is element node`, () => {
    expect(cdataSectionNode.parentNode).toBe(elementNode);
  });

  it(`hasChildNodes() is false`, () => {
    expect(cdataSectionNode.hasChildNodes()).toBe(false);
  });

  it(`childNodes.length is 0`, () => {
    expect(cdataSectionNode.childNodes.length).toEqual(0);
  });

  it(`firstChild must be null`, () => {
    expect(cdataSectionNode.firstChild).toBe(null);
  });

  it(`lastChild must be null`, () => {
    expect(cdataSectionNode.lastChild).toBe(null);
  });

  it(`data must be ${text}`, () => {
    expect(cdataSectionNode.data).toBe(text);
  });
  
  describe('Namespace tests', () => {
    it('can lookupPrefix', () => {
      expect(cdataSectionNode2.lookupPrefix(ns2)).toBe(pfx);
    });

    it('can lookupNamespaceURI', () => {
      expect(cdataSectionNode2.lookupNamespaceURI(pfx)).toBe(ns2);
    });
    
    it('can check isDefaultNamespace when true', () => {
      expect(cdataSectionNode.isDefaultNamespace('')).toBe(true);
    });
    
    it('can check isDefaultNamespace when false', () => {
      expect(cdataSectionNode2.isDefaultNamespace('')).toBe(false);
    });

    it('can check isDefaultNamespace when true and namespace is not empty', () => {
      expect(cdataSectionNode2.isDefaultNamespace(ns1)).toBe(true);
    });
  });
});
