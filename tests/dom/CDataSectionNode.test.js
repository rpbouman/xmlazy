import * as xmlazy from '../../src/xmlazy.js';

describe('CData Section', () => {

  const text = 'world';
  const cdata = `<![CDATA[${text}]]>`;
  let 
    staxStringReader, staxResult, 
    xml, elementNode, cdataSectionNode
  ; 
  beforeAll(() => {
    xml = `<hello>${cdata}</hello>`;
    staxStringReader = new xmlazy.StaxStringReader(xml, {chainNodes: true});
    staxResult = staxStringReader.next();
    elementNode = staxResult.value;
    staxResult = staxStringReader.next();
    cdataSectionNode = staxResult.value;
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

});
