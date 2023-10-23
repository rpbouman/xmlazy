import * as xmlazy from '../../src/xmlazy.js';

describe('Document Node', () => {

  const tagname = 'hello';
  const xml = `<${tagname}>`;
  let staxStringReader, staxResult, documentNode, elementNode;

  const doctype = '<!DOCTYPE html>';
  const html = `${doctype}<html/>`;
  let staxStringReader2, htmlDocumentNode;

  const ns1 = 'http://www.ns.hello1/';
  const ns2 = 'http://www.ns.hello2/';
  const pfx = 'pfx';
  let staxStringReader3, nsDocumentNode;

  beforeAll(() => {
    staxStringReader = new xmlazy.StaxStringReader(xml);
    documentNode = staxStringReader.buildDocument();
    
    staxStringReader2 = new xmlazy.StaxStringReader(html);
    htmlDocumentNode = staxStringReader2.buildDocument();
    
    staxStringReader3 = new xmlazy.StaxStringReader(`<${pfx}:tag xmlns="${ns1}" xmlns:${pfx}="${ns2}">`);
    nsDocumentNode = staxStringReader3.buildDocument();
    
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
    
    it(`doctype is null`, () => {
      expect(documentNode.doctype).toBe(null);
    });

  });
 
  describe('doctype test', () =>{
    it(`doctype is not null`, () => {
      expect(htmlDocumentNode.doctype).not.toBe(null);
    });

    it(`doctype is of type DOCUMENT_TYPE_NODE`, () => {
      expect(htmlDocumentNode.doctype.nodeType).toBe(10);
    });
    
  });

  describe('namespace tests', () =>{
    it(`lookupPrefix(null) is null`, () => {
      expect(documentNode.lookupPrefix(null)).toBe(null);
    });

    it(`lookupNamespaceURI(null) is null`, () => {
      expect(documentNode.lookupNamespaceURI(null)).toBe(null);
    });

    it(`isDefaultNamespace(null) is true`, () => {
      expect(documentNode.isDefaultNamespace(null)).toBe(true);
    });

    it(`isDefaultNamespace('') is true`, () => {
      expect(documentNode.isDefaultNamespace('')).toBe(true);
    });

    it(`lookupPrefix(${ns1}) is null`, () => {
      expect(nsDocumentNode.lookupPrefix(ns1)).toBe(null);
    });

    it(`lookupPrefix(${ns2}) is ${pfx}`, () => {
      expect(nsDocumentNode.lookupPrefix(ns2)).toBe(pfx);
    });

    it(`lookupNamespaceURI(null}) is ${ns1}`, () => {
      expect(nsDocumentNode.lookupNamespaceURI(null)).toBe(ns1);
    });

    it(`lookupNamespaceURI(${pfx}) is ${ns2}`, () => {
      expect(nsDocumentNode.lookupNamespaceURI(pfx)).toBe(ns2);
    });
    
    it(`isDefaultNamespace(${ns1}) is true`, () => {
      expect(nsDocumentNode.isDefaultNamespace(ns1)).toBe(true);
    });
  });

  
  describe('DocumentElement tests', () => {
    it(`has a documentElement"`, () => {
      const elementNode = documentNode.documentElement;
      expect(elementNode.nodeType).toBe(1);
      expect(elementNode.nodeName).toBe(tagname);
    });

    it(`is ownerDocument of documentElement`, () => {
      const elementNode = documentNode.documentElement
      expect(documentNode).toBe(elementNode.ownerDocument);
    });

    it(`hasChildnodes() is true`, () => {
      expect(documentNode.hasChildNodes()).toBe(true);
    });

    it(`childNodes.length is 1`, () => {
      const childNodes = documentNode.childNodes;
      expect(childNodes.length).toBe(1);
    });

    it(`childnode is the documentElement`, () => {
      const childNodes = documentNode.childNodes;
      expect(childNodes.item(0)).toBe(documentNode.documentElement);
    });

  });
  
  describe('DocumentElement getElementById tests', () => {

    let staxStringReader, documentNode;
    beforeAll(() => {
      const xml = '<a id="1"><z xmlns:z="http://www.zzz.com/"><zz z:id="zId" id="xxx"/></z><b id="2"/><c id="1"><d id="2">text</d></c></a>'
      staxStringReader = new xmlazy.StaxStringReader(xml);
      documentNode = staxStringReader.buildDocument();
    });
    
    it(`gets element by id on the documentElement`, () => {
      const node = documentNode.getElementById('1')
      expect(node).not.toBe(null);
      expect(node).toBeDefined();
      expect(node.tagName).toBe('a');
    });

    it(`gets only the first element with an id`, () => {
      const node = documentNode.getElementById('2')
      expect(node).not.toBe(null);
      expect(node).toBeDefined();
      expect(node.tagName).toBe('b');
    });
    
    it(`ignores id attribute if its not in the default namespace`, () => {
      const node = documentNode.getElementById('zId')
      expect(node).toBe(null);
    });

    it(`gets the id attribute even if there is a namespaced id attribute too`, () => {
      const node = documentNode.getElementById('xxx')
      expect(node).not.toBe(null);
      expect(node).toBeDefined();
      expect(node.tagName).toBe('zz');
    });
    
  });

  describe('ElementsByTagName', () => {

    const listns = 'urn:corp:list';
    const empns = 'urn:corp:emp';
    const secns = 'urn:corp:sec';
    const listns2 = 'urn:corp:list2';
    
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
        <list:personList xmlns:list="${listns2}">
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
    });

    it('getElementsByTagName(*)', () => {
      const descendants = doc.getElementsByTagNameNS('*', '*');
      expect(descendants.length).toBe(9);
    });

    it('getElementsByTagName(list:personList)', () => {
      const descendants = doc.getElementsByTagName('list:personList');
      expect(descendants.length).toBe(2);
    });

    it('getElementsByTagName(xxx)', () => {
      const descendants = doc.getElementsByTagName('xxx');
      expect(descendants.length).toBe(0);
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
    });

    it('getElementsByTagNameNS(*, *)', () => {
      const descendants = doc.getElementsByTagNameNS('*', '*');
      expect(descendants.length).toBe(9);
    });

    it('getElementsByTagNameNS(namespace, *)', () => {
      const descendants = doc.getElementsByTagNameNS(listns, '*');
      expect(descendants.length).toBe(3);
    });

    it('getElementsByTagNameNS(*, name)', () => {
      const descendants = doc.getElementsByTagNameNS('*', 'name');
      expect(descendants.length).toBe(4);
    });

    it('getElementsByTagNameNS(namespace, name)', () => {
      const descendants = doc.getElementsByTagNameNS(secns, 'name');
      expect(descendants.length).toBe(2);
    });

  });
  
});
