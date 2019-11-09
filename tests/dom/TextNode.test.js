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

});
