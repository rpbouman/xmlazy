import * as xmlazy from '../../src/xmlazy.js';

describe('Comment', () => {

  const text = 'world';
  const comment = `<!--${text}-->`;
  let 
    staxStringReader, staxResult, 
    xml, elementNode, commentSectionNode
  ; 
  beforeAll(() => {
    xml = `<hello>${comment}</hello>`;
    staxStringReader = new xmlazy.StaxStringReader(xml, {chainNodes: true});
    staxResult = staxStringReader.next();
    elementNode = staxResult.value;
    staxResult = staxStringReader.next();
    commentSectionNode = staxResult.value;
  });

  it('nodeType is 8', () => {
    expect(commentSectionNode.nodeType).toBe(8);
  });

  it(`sourceXml is "${comment}"`, () => {
    expect(commentSectionNode.sourceXml).toBe(comment);
  });

  it(`nodeValue is "${text}"`, () => {
    expect(commentSectionNode.nodeValue).toBe(text);
  });

  it(`data is "${text}"`, () => {
    expect(commentSectionNode.data).toBe(text);
  });

  it(`textContent is "${text}"`, () => {
    expect(commentSectionNode.textContent).toBe(commentSectionNode.data);
  });

  it(`nodeName is "#comment"`, () => {
    expect(commentSectionNode.nodeName).toBe('#comment');
  });

  it(`parentNode is element node`, () => {
    expect(commentSectionNode.parentNode).toBe(elementNode);
  });

  it(`hasChildNodes() is false`, () => {
    expect(commentSectionNode.hasChildNodes()).toBe(false);
  });

  it(`childNodes.length is 0`, () => {
    expect(commentSectionNode.childNodes.length).toEqual(0);
  });

  it(`firstChild must be null`, () => {
    expect(commentSectionNode.firstChild).toBe(null);
  });

  it(`lastChild must be null`, () => {
    expect(commentSectionNode.lastChild).toBe(null);
  });

});
