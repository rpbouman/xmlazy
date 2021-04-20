import * as xmlazy from '../../src/xmlazy.js';

describe('Attributes', () => {
  
  const prefix = 'p';
  const namespace = 'http://www.ns.com/'
  const attributeTestset = [
    {prefix: null, localName: 'att1', value: 'value'},
    {prefix: prefix, namespace: namespace, localName: 'att1', value: 'value'},
    {prefix: null, localName: 'att2', value: 'value with a > inside'},
    {prefix: null, localName: 'att3', value: 'value with multiple >> inside'},
    {prefix: null, localName: 'att4', value: 'single quote'},
    {prefix: null, localName: 'att5', value: 'one space before the = but not after'},
    {prefix: null, localName: 'att6', value: 'one space after the = but not before'},
    {prefix: null, localName: 'att7', value: 'one space on eitherside of the ='},
    {prefix: null, localName: 'att8', value: 'multiple spaces before the = but not after'},
    {prefix: null, localName: 'att9', value: 'multiple spaces after the = but not before'},
    {prefix: null, localName: 'att10', value: 'multiple spaces on eitherside of the ='},
    {prefix: null, localName: 'att11', value: 'double quoted value with one \' inside'},
    {prefix: null, localName: 'att12', value: 'single quoted value with one " inside'},
    {prefix: null, localName: 'att13', value: 'double quoted value with \' multiple \' inside'},
    {prefix: null, localName: 'att14', value: 'single quoted value with " multiple " inside'},
    {prefix: null, localName: 'att15', value: "with named entity '"},
    {prefix: null, localName: 'att16', value: "with hex entity α"},
    {prefix: null, localName: 'att17', value: "with dec entity A"}
  ];

  const attributes = `
    att1="value"
    ${prefix}:att1="value"
    att2="value with a > inside"
    att3="value with multiple >> inside"
    att4='single quote'
    att5 ='one space before the = but not after'
    att6= 'one space after the = but not before'
    att7 = 'one space on eitherside of the ='
    att8   ='multiple spaces before the = but not after'
    att9=   'multiple spaces after the = but not before'
    att10   =   'multiple spaces on eitherside of the ='
    att11="double quoted value with one ' inside"
    att12='single quoted value with one " inside'
    att13="double quoted value with ' multiple ' inside"
    att14='single quoted value with " multiple " inside'
    att15="with named entity &apos;"
    att16="with hex entity &#x3B1;"
    att17="with dec entity &#65;"
  `;
  
  describe('General attributes test', () => {
    const tagname = 'hello';
    const xml = `<${tagname} xmlns:${prefix}="${namespace}" ${attributes}>`;
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
    
    it(`has a attribute iterator`, () => {
      expect(elementNode.getAttributeIterator()).toBeDefined();
    });

    it(`can iterate all attributes`, () => {
      var iteratorResult, iterator = elementNode.getAttributeIterator();
      var i = 0, attributeData, attributeNode;
      while (!(iteratorResult = iterator.next()).done){
        attributeNode = iteratorResult.value;
        attributeData = attributeTestset[i++];
        expect(attributeNode.nodeType).toBe(2);
        expect(attributeNode.parentNode).toBe(null);
        expect(attributeNode.prefix).toBe(attributeData.prefix);
        expect(attributeNode.localName).toBe(attributeData.localName);
        expect(attributeNode.value).toBe(attributeData.value);
        expect(attributeNode.nodeValue).toBe(attributeData.value);
        expect(attributeNode.textContent).toBe(attributeData.value);
        expect(attributeNode.ownerElement).toBe(elementNode);
        expect(attributeNode.hasChildNodes()).toBe(false);
        expect(attributeNode.childNodes.length).toEqual(0);
      }
    });
    
    it(`implements getAttributeNames()`, ()=>{
      var attributeNames = elementNode.getAttributeNames();
      var testNames = attributeTestset.map((data) => {
        return (data.prefix ? data.prefix + ':' : '') + data.localName;
      });
      expect(attributeNames).toEqual(testNames);
    });
    
    it(`Can get attributes`, () => {
      expect(elementNode.attributes).toBeDefined();
    });

    describe("Attributes from map", () => {
      var attributeNode, name, attributeData, i, n = attributeTestset.length;
      for (i = 0; i < n; i++) {
        attributeData =  attributeTestset[i];
        name = attributeData.localName;
        if (attributeData.prefix){
          name = `${attributeData.prefix}:${name}`;
        }
        describe(`Attribute ${name}`, () => {
          beforeAll(() =>{
            var attributeMap = elementNode.getAttributeNodeMap();
            attributeNode = attributeMap[name];
          });
          it('attribute defined', () => {
            expect(attributeNode).toBeDefined();          
          });
          it('attribute not null', () => {
            expect(attributeNode).not.toBe(null);          
          });
          it(`nodeName to equal "${name}"`, () => {
            expect(attributeNode.nodeName).toBe(name);
          });
          it(`name to equal "${name}"`, () => {
            expect(attributeNode.name).toBe(name);
          });
          it(`prefix to equal "${attributeData.prefix}"`, () => {
            expect(attributeNode.prefix).toBe(attributeData.prefix);
          });
          it(`namespaceURI to equal "${attributeData.namespace === undefined ? 'null' : attributeData.namespace}"`, () => {
            expect(attributeNode.namespaceURI).toBe(attributeData.namespace === undefined ? null : attributeData.namespace);
          });
          it(`localName to equal "${attributeData.localName}"`, () => {
            expect(attributeNode.localName).toBe(attributeData.localName);
          });
          it(`value to equal "${attributeData.value}"`, () => {
            expect(attributeNode.value).toBe(attributeData.value);
          });
        });
      }
    });

    describe("Attributes by name from attribute map", () => {
      var attributeNode, name, attributeData, i, n = attributeTestset.length;
      for (i = 0; i < n; i++) {
        attributeData =  attributeTestset[i];
        name = attributeData.localName;
        if (attributeData.prefix){
          name = `${attributeData.prefix}:${name}`;
        }
        describe(`Attribute ${name}`, () => {
          beforeAll(() =>{
            attributeNode = elementNode.attributes.getNamedItem(name);
          });
          it('attribute not null', () => {
            expect(attributeNode).not.toBe(null);          
          });
          it(`nodeName to equal "${name}"`, () => {
            expect(attributeNode.nodeName).toBe(name);
          });
          it(`name to equal "${name}"`, () => {
            expect(attributeNode.name).toBe(name);
          });
          it(`prefix to equal "${attributeData.prefix}"`, () => {
            expect(attributeNode.prefix).toBe(attributeData.prefix);
          });
          it(`localName to equal "${attributeData.localName}"`, () => {
            expect(attributeNode.localName).toBe(attributeData.localName);
          });
          it(`value to equal "${attributeData.value}"`, () => {
            expect(attributeNode.value).toBe(attributeData.value);
          });
        });
      }
    });

    describe("Attributes by index", () => {
      var attributeNode, attributeData, i, n = attributeTestset.length;
      for (i = 0; i < n; i++) {
        attributeData =  attributeTestset[i];
        describe(`Attribute ${i}`, () => {
          var name;
          beforeAll(() =>{
            name = attributeData.localName;
            if (attributeData.prefix){
              name = `${attributeData.prefix}:${name}`;
            }
            attributeNode = elementNode.attributes.item(i);
          });
          it('attribute not null', () => {
            expect(attributeNode).not.toBe(null);          
          });
          it(`nodeName to equal "${name}"`, () => {
            expect(attributeNode.nodeName).toBe(name);
          });
          it(`name to equal "${name}"`, () => {
            expect(attributeNode.name).toBe(name);
          });
          it(`prefix to equal "${attributeData.prefix}"`, () => {
            expect(attributeNode.prefix).toBe(attributeData.prefix);
          });
          it(`namespaceURI to equal "${attributeData.namespace === undefined ? 'null' : attributeData.namespace}"`, () => {
            expect(attributeNode.namespaceURI).toBe(attributeData.namespace === undefined ? null : attributeData.namespace);
          });
          it(`localName to equal "${attributeData.localName}"`, () => {
            expect(attributeNode.localName).toBe(attributeData.localName);
          });
          it(`value to equal "${attributeData.value}"`, () => {
            expect(attributeNode.value).toBe(attributeData.value);
          });
        });
      }
    });
        
    it(`Can get attributes length`, () => {
      expect(elementNode.attributes.length).toEqual(attributeTestset.length);
    });
    
    describe("element.getAttributeNode()", () => {
      var attributeNode, name, attributeData, i, n = attributeTestset.length;
      for (i = 0; i < n; i++) {
        attributeData =  attributeTestset[i];
        name = attributeData.localName;
        if (attributeData.prefix){
          name = `${attributeData.prefix}:${name}`;
        }
        describe(`Attribute ${name}`, () => {
          beforeAll(() =>{
            attributeNode = elementNode.getAttributeNode(name);
          });
          it('attribute not null', () => {
            expect(attributeNode).not.toBe(null);          
          });
          it(`nodeName to equal "${name}"`, () => {
            expect(attributeNode.nodeName).toBe(name);
          });
          it(`name to equal "${name}"`, () => {
            expect(attributeNode.name).toBe(name);
          });
          it(`prefix to equal "${attributeData.prefix}"`, () => {
            expect(attributeNode.prefix).toBe(attributeData.prefix);
          });
          it(`namespaceURI to equal "${attributeData.namespace === undefined ? 'null' : attributeData.namespace}"`, () => {
            expect(attributeNode.namespaceURI).toBe(attributeData.namespace === undefined ? null : attributeData.namespace);
          });
          it(`localName to equal "${attributeData.localName}"`, () => {
            expect(attributeNode.localName).toBe(attributeData.localName);
          });
          it(`value to equal "${attributeData.value}"`, () => {
            expect(attributeNode.value).toBe(attributeData.value);
          });
        });
      }
    });    

    describe("element.getAttributeNodeNS()", () => {
      var attributeNode, name, namespace, attributeData, i, n = attributeTestset.length;
      for (i = 0; i < n; i++) {
        attributeData =  attributeTestset[i];
        name = attributeData.localName;
        namespace = attributeData.namespace === undefined ? null : attributeData.namespace;
        describe(`Attribute ${name} (namespace ${namespace})`, () => {
          beforeAll(() =>{
            attributeNode = elementNode.getAttributeNodeNS(namespace, name);
          });
          it('attribute not null', () => {
            expect(attributeNode).not.toBe(null);          
          });
          it(`nodeName to equal "${name}"`, () => {
            expect(attributeNode.nodeName).toBe(name);
          });
          it(`name to equal "${name}"`, () => {
            expect(attributeNode.name).toBe(name);
          });
          it(`prefix to equal "${attributeData.prefix}"`, () => {
            expect(attributeNode.prefix).toBe(attributeData.prefix);
          });
          it(`namespaceURI to equal "${attributeData.namespace === undefined ? 'null' : attributeData.namespace}"`, () => {
            expect(attributeNode.namespaceURI).toBe(attributeData.namespace === undefined ? null : attributeData.namespace);
          });
          it(`localName to equal "${attributeData.localName}"`, () => {
            expect(attributeNode.localName).toBe(attributeData.localName);
          });
          it(`value to equal "${attributeData.value}"`, () => {
            expect(attributeNode.value).toBe(attributeData.value);
          });
        });
      }
    });
    
    describe("element.getAttribute()", () => {
      var attributeNode, name, attributeData, i, n = attributeTestset.length;
      for (i = 0; i < n; i++) {
        attributeData =  attributeTestset[i];
        name = attributeData.localName;
        if (attributeData.prefix){
          name = `${attributeData.prefix}:${name}`;
        }
        it(`getAttribute(${name})`, () => {
          expect(elementNode.getAttribute(name)).toBe(attributeData.value);
        });
      }
    });

    describe("element.getAttributeNS()", () => {
      var attributeNode, name, namespace, attributeData, i, n = attributeTestset.length;
      for (i = 0; i < n; i++) {
        attributeData =  attributeTestset[i];
        name = attributeData.localName;
        namespace = attributeData.namespace === undefined ? null : attributeData.namespace;
        it(`getAttributeNS(${namespace}, ${name})`, () => {
          expect(elementNode.getAttributeNS(namespace, name)).toBe(attributeData.value);
        });
      }
    });
    
  });
  
});
