import * as xmlazy from '../../src/xmlazy.js';

describe('StaxStringReader', () => {
  
  describe('StaxStringReader passing handler to parse method', () => {
    var saxStringReader, data, i; 
    
    beforeAll(() => {
      saxStringReader = new xmlazy.StaxStringReader(`
        <?xml version="1.0"?>
        <document-element>
          <empty-element/>
          <text-content>Text</text-content>
        </document-element>
      `);
      data = [
        {nodeType: 9},
        {nodeType: 3},
        {nodeType: 7, sourceXml: '<?xml version="1.0"?>'},
        {nodeType: 3},
        {nodeType: 1, sourceXml: '<document-element>'},
        {nodeType: 3},
        {nodeType: 1, sourceXml: '<empty-element/>'},
        {nodeType: 3},
        {nodeType: 1, sourceXml: '<text-content>'},
        {nodeType: 3, sourceXml: 'Text'},
        {nodeType: -1, sourceXml: '</text-content>'},
        {nodeType: 3},
        {nodeType: -1, sourceXml: '</document-element>'},
        {nodeType: 3},
        {nodeType: -9}
      ];
      i = 0;
    });
    
    it('parses nodes as sax events', () => {
      saxStringReader.parseAndCallback(function(node){
        var d = data[i];
        expect(node.nodeType).toBe(d.nodeType);
        if (d.sourceXml) {
          expect(node.sourceXml).toBe(d.sourceXml);
        }
        i += 1;
      });
    });
  
  });
  
  describe('StaxStringReader passing handler to constructor', () => {
    var saxStringReader, data, i; 
    
    beforeAll(() => {
      saxStringReader = new xmlazy.StaxStringReader(`
        <?xml version="1.0"?>
        <document-element>
          <empty-element/>
          <text-content>Text</text-content>
        </document-element>
      `, {
        saxHandler: function(node){
          var d = data[i];
          expect(node.nodeType).toBe(d.nodeType);
          if (d.sourceXml) {
            expect(node.sourceXml).toBe(d.sourceXml);
          }
          i += 1;
        }
      });
      data = [
        {nodeType: 9},
        {nodeType: 3},
        {nodeType: 7, sourceXml: '<?xml version="1.0"?>'},
        {nodeType: 3},
        {nodeType: 1, sourceXml: '<document-element>'},
        {nodeType: 3},
        {nodeType: 1, sourceXml: '<empty-element/>'},
        {nodeType: 3},
        {nodeType: 1, sourceXml: '<text-content>'},
        {nodeType: 3, sourceXml: 'Text'},
        {nodeType: -1, sourceXml: '</text-content>'},
        {nodeType: 3},
        {nodeType: -1, sourceXml: '</document-element>'},
        {nodeType: 3},
        {nodeType: -9}
      ];
      i = 0;
    });
    
    it('parses nodes as sax events', () => {
      saxStringReader.parseAndCallback();
    });
  
  });

  describe('StaxStringReader passing handler to constructor, and string to the parse method.', () => {
    var saxStringReader, data, i; 
    
    beforeAll(() => {
      saxStringReader = new xmlazy.StaxStringReader({
        saxHandler: function(node){
          var d = data[i];
          expect(node.nodeType).toBe(d.nodeType);
          if (d.sourceXml) {
            expect(node.sourceXml).toBe(d.sourceXml);
          }
          i += 1;
        }
      });
      
      data = [
        {nodeType: 9},
        {nodeType: 3},
        {nodeType: 7, sourceXml: '<?xml version="1.0"?>'},
        {nodeType: 3},
        {nodeType: 1, sourceXml: '<document-element>'},
        {nodeType: 3},
        {nodeType: 1, sourceXml: '<empty-element/>'},
        {nodeType: 3},
        {nodeType: 1, sourceXml: '<text-content>'},
        {nodeType: 3, sourceXml: 'Text'},
        {nodeType: -1, sourceXml: '</text-content>'},
        {nodeType: 3},
        {nodeType: -1, sourceXml: '</document-element>'},
        {nodeType: 3},
        {nodeType: -9}
      ];
      i = 0;
    });
    
    it('parses nodes as sax events', () => {
      saxStringReader.parseAndCallback(`
        <?xml version="1.0"?>
        <document-element>
          <empty-element/>
          <text-content>Text</text-content>
        </document-element>
      `);
    });
  
  });

});
