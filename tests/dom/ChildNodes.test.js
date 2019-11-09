import * as xmlazy from '../../src/xmlazy.js';

describe('ChildNodes', () => {
  
  describe('Document ChildNodesIterator', () => {

    it('Can iterate children of simple shallow document', () => {
      var staxStringReader = new xmlazy.StaxStringReader(`
        <!-- Here's my document -->
        <?xml version="1.0"?>
        <hello/>
        <!-- That was my document -->
      `);
      
      var doc = staxStringReader.buildDocument();
      var childNodeResult, childNodeIterator = doc.getChildNodeIterator();
      var i = 0;
      var data = [
        {nodeType: 3},
        {nodeType: 8, sourceXml: "<!-- Here's my document -->" },
        {nodeType: 3},
        {nodeType: 7, sourceXml: '<?xml version="1.0"?>' },
        {nodeType: 3},
        {nodeType: 1, sourceXml: '<hello/>' },
        {nodeType: 3},
        {nodeType: 8, sourceXml: "<!-- That was my document -->" },
        {nodeType: 3}
      ];
      while (!(childNodeResult = childNodeIterator.next()).done) {
        var childNode = childNodeResult.value;
        var referenceData = data[i];
        expect(childNode.nodeType).toBe(referenceData.nodeType);
        if (referenceData.sourceXml !== undefined) {
          expect(childNode.sourceXml).toBe(referenceData.sourceXml);
        }
        i += 1;
      }
    });
    
    it('Can iterate children of a document with a document element with text content', () => {
      var staxStringReader = new xmlazy.StaxStringReader(`
        <!-- Here's my document -->
        <?xml version="1.0"?>
        <hello>
        </hello>
        <!-- That was my document -->
      `);
      
      var doc = staxStringReader.buildDocument();
      var childNodeResult, childNodeIterator = doc.getChildNodeIterator();
      var i = 0;
      var data = [
        {nodeType: 3},
        {nodeType: 8, sourceXml: "<!-- Here's my document -->" },
        {nodeType: 3},
        {nodeType: 7, sourceXml: '<?xml version="1.0"?>' },
        {nodeType: 3},
        {nodeType: 1, sourceXml: '<hello>' },
        {nodeType: 3},
        {nodeType: 8, sourceXml: "<!-- That was my document -->" },
        {nodeType: 3}
      ];
      while (!(childNodeResult = childNodeIterator.next()).done) {
        var childNode = childNodeResult.value;
        var referenceData = data[i];
        expect(childNode.nodeType).toBe(referenceData.nodeType);
        if (referenceData.sourceXml !== undefined) {
          expect(childNode.sourceXml).toBe(referenceData.sourceXml);
        }
        i += 1;
      }
    });
    
    it('Can iterate children of a document with a document element with element content', () => {
      var staxStringReader = new xmlazy.StaxStringReader(`
        <!-- Here's my document -->
        <?xml version="1.0"?>
        <hello>
          <world/>
        </hello>
        <!-- That was my document -->
      `);
      
      var doc = staxStringReader.buildDocument();
      var childNodeResult, childNodeIterator = doc.getChildNodeIterator();
      var i = 0;
      var data = [
        {nodeType: 3},
        {nodeType: 8, sourceXml: "<!-- Here's my document -->" },
        {nodeType: 3},
        {nodeType: 7, sourceXml: '<?xml version="1.0"?>' },
        {nodeType: 3},
        {nodeType: 1, sourceXml: '<hello>' },
        {nodeType: 3},
        {nodeType: 8, sourceXml: "<!-- That was my document -->" },
        {nodeType: 3}
      ];
      while (!(childNodeResult = childNodeIterator.next()).done) {
        var childNode = childNodeResult.value;
        var referenceData = data[i];
        expect(childNode.nodeType).toBe(referenceData.nodeType);
        if (referenceData.sourceXml !== undefined) {
          expect(childNode.sourceXml).toBe(referenceData.sourceXml);
        }
        i += 1;
      }
    });

    it('Can iterate children of a document with a document element with nested element content', () => {
      var staxStringReader = new xmlazy.StaxStringReader(`
        <!-- Here's my document -->
        <?xml version="1.0"?>
        <hello>
          <america>
            <north-america/>
            <south-america/>
          </america>
          <europe>
            <west-europe/>
            <east-europe/>
          </europe>
          <antarctica/>
        </hello>
        <!-- That was my document -->
      `);
      
      var doc = staxStringReader.buildDocument();
      var childNodeResult, childNodeIterator = doc.getChildNodeIterator();
      var i = 0;
      var data = [
        {nodeType: 3},
        {nodeType: 8, sourceXml: "<!-- Here's my document -->" },
        {nodeType: 3},
        {nodeType: 7, sourceXml: '<?xml version="1.0"?>' },
        {nodeType: 3},
        {nodeType: 1, sourceXml: '<hello>' },
        {nodeType: 3},
        {nodeType: 8, sourceXml: "<!-- That was my document -->" },
        {nodeType: 3}
      ];
      while (!(childNodeResult = childNodeIterator.next()).done) {
        var childNode = childNodeResult.value;
        var referenceData = data[i];
        expect(childNode.nodeType).toBe(referenceData.nodeType);
        if (referenceData.sourceXml !== undefined) {
          expect(childNode.sourceXml).toBe(referenceData.sourceXml);
        }
        i += 1;
      }
    });
    
  });

  describe('Document Element ChildNodesIterator', () => {

    it('Can iterate children of simple shallow element', () => {
      var staxStringReader = new xmlazy.StaxStringReader(`
        <root>
          <!-- Here's my document -->
          <?xml version="1.0"?>
          <hello/>
          <!-- That was my document -->
        </root>
      `);
      
      var doc = staxStringReader.buildDocument();
      var docElement = doc.documentElement;
      var childNodeResult, childNodeIterator = docElement.getChildNodeIterator();
      var i = 0;
      var data = [
        {nodeType: 3},
        {nodeType: 8, sourceXml: "<!-- Here's my document -->" },
        {nodeType: 3},
        {nodeType: 7, sourceXml: '<?xml version="1.0"?>' },
        {nodeType: 3},
        {nodeType: 1, sourceXml: '<hello/>' },
        {nodeType: 3},
        {nodeType: 8, sourceXml: "<!-- That was my document -->" },
        {nodeType: 3}
      ];
      while (!(childNodeResult = childNodeIterator.next()).done) {
        var childNode = childNodeResult.value;
        var referenceData = data[i];
        expect(childNode.nodeType).toBe(referenceData.nodeType);
        if (referenceData.sourceXml !== undefined) {
          expect(childNode.sourceXml).toBe(referenceData.sourceXml);
        }
        i += 1;
      }
    });
    
    it('Can iterate children of an element with text content', () => {
      var staxStringReader = new xmlazy.StaxStringReader(`
        <root>
          <!-- Here's my document -->
          <?xml version="1.0"?>
          <hello>
          </hello>
          <!-- That was my document -->
        </root>
      `);
      
      var doc = staxStringReader.buildDocument();
      var docElement = doc.documentElement;
      var childNodeResult, childNodeIterator = docElement.getChildNodeIterator();
      var i = 0;
      var data = [
        {nodeType: 3},
        {nodeType: 8, sourceXml: "<!-- Here's my document -->" },
        {nodeType: 3},
        {nodeType: 7, sourceXml: '<?xml version="1.0"?>' },
        {nodeType: 3},
        {nodeType: 1, sourceXml: '<hello>' },
        {nodeType: 3},
        {nodeType: 8, sourceXml: "<!-- That was my document -->" },
        {nodeType: 3}
      ];
      while (!(childNodeResult = childNodeIterator.next()).done) {
        var childNode = childNodeResult.value;
        var referenceData = data[i];
        expect(childNode.nodeType).toBe(referenceData.nodeType);
        if (referenceData.sourceXml !== undefined) {
          expect(childNode.sourceXml).toBe(referenceData.sourceXml);
        }
        i += 1;
      }
    });
    
    it('Can iterate children of an element with element content', () => {
      var staxStringReader = new xmlazy.StaxStringReader(`
        <root>
          <!-- Here's my document -->
          <?xml version="1.0"?>
          <hello>
            <world/>
          </hello>
          <!-- That was my document -->
        </root>
      `);
      
      var doc = staxStringReader.buildDocument();
      var docElement = doc.documentElement;
      var childNodeResult, childNodeIterator = docElement.getChildNodeIterator();
      var i = 0;
      var data = [
        {nodeType: 3},
        {nodeType: 8, sourceXml: "<!-- Here's my document -->" },
        {nodeType: 3},
        {nodeType: 7, sourceXml: '<?xml version="1.0"?>' },
        {nodeType: 3},
        {nodeType: 1, sourceXml: '<hello>' },
        {nodeType: 3},
        {nodeType: 8, sourceXml: "<!-- That was my document -->" },
        {nodeType: 3}
      ];
      while (!(childNodeResult = childNodeIterator.next()).done) {
        var childNode = childNodeResult.value;
        var referenceData = data[i];
        expect(childNode.nodeType).toBe(referenceData.nodeType);
        if (referenceData.sourceXml !== undefined) {
          expect(childNode.sourceXml).toBe(referenceData.sourceXml);
        }
        i += 1;
      }
    });

    it('Can iterate children of an element with nested element content', () => {
      var staxStringReader = new xmlazy.StaxStringReader(`
        <root>
          <!-- Here's my document -->
          <?xml version="1.0"?>
          <hello>
            <america>
              <north-america/>
              <south-america/>
            </america>
            <europe>
              <west-europe/>
              <east-europe/>
            </europe>
            <antarctica/>
          </hello>
          <!-- That was my document -->
        </root>
      `);
      
      var doc = staxStringReader.buildDocument();
      var docElement = doc.documentElement;
      var childNodeResult, childNodeIterator = docElement.getChildNodeIterator();
      var i = 0;
      var data = [
        {nodeType: 3},
        {nodeType: 8, sourceXml: "<!-- Here's my document -->" },
        {nodeType: 3},
        {nodeType: 7, sourceXml: '<?xml version="1.0"?>' },
        {nodeType: 3},
        {nodeType: 1, sourceXml: '<hello>' },
        {nodeType: 3},
        {nodeType: 8, sourceXml: "<!-- That was my document -->" },
        {nodeType: 3}
      ];
      while (!(childNodeResult = childNodeIterator.next()).done) {
        var childNode = childNodeResult.value;
        var referenceData = data[i];
        expect(childNode.nodeType).toBe(referenceData.nodeType);
        if (referenceData.sourceXml !== undefined) {
          expect(childNode.sourceXml).toBe(referenceData.sourceXml);
        }
        i += 1;
      }
    });
    
  });

  describe('Document childNodes node list', () => {

    it('Can iterate children of simple shallow document', () => {
      var staxStringReader = new xmlazy.StaxStringReader(`
        <!-- Here's my document -->
        <?xml version="1.0"?>
        <hello/>
        <!-- That was my document -->
      `);
      
      var doc = staxStringReader.buildDocument();
      var data = [
        {nodeType: 3},
        {nodeType: 8, sourceXml: "<!-- Here's my document -->" },
        {nodeType: 3},
        {nodeType: 7, sourceXml: '<?xml version="1.0"?>' },
        {nodeType: 3},
        {nodeType: 1, sourceXml: '<hello/>' },
        {nodeType: 3},
        {nodeType: 8, sourceXml: "<!-- That was my document -->" },
        {nodeType: 3}
      ];
      var childNode, d, childNodes = doc.childNodes;
      expect(childNodes.length).toBe(data.length);
      for (var i = 0; i < childNodes.length; i++){
        d = data[i];
        childNode = childNodes.item(i);
        expect(childNode.nodeType).toBe(d.nodeType);
        if (d.sourceXml !== undefined) {
          expect(childNode.sourceXml).toBe(d.sourceXml);
        }
      }
    });
    
    it('Can iterate children of a document with a document element with text content', () => {
      var staxStringReader = new xmlazy.StaxStringReader(`
        <!-- Here's my document -->
        <?xml version="1.0"?>
        <hello>
        </hello>
        <!-- That was my document -->
      `);
      
      var doc = staxStringReader.buildDocument();
      var data = [
        {nodeType: 3},
        {nodeType: 8, sourceXml: "<!-- Here's my document -->" },
        {nodeType: 3},
        {nodeType: 7, sourceXml: '<?xml version="1.0"?>' },
        {nodeType: 3},
        {nodeType: 1, sourceXml: '<hello>' },
        {nodeType: 3},
        {nodeType: 8, sourceXml: "<!-- That was my document -->" },
        {nodeType: 3}
      ];
      var childNode, d, childNodes = doc.childNodes;
      expect(childNodes.length).toBe(data.length);
      for (var i = 0; i < childNodes.length; i++){
        d = data[i];
        childNode = childNodes.item(i);
        expect(childNode.nodeType).toBe(d.nodeType);
        if (d.sourceXml !== undefined) {
          expect(childNode.sourceXml).toBe(d.sourceXml);
        }
      }
    });
    
    it('Can iterate children of a document with a document element with element content', () => {
      var staxStringReader = new xmlazy.StaxStringReader(`
        <!-- Here's my document -->
        <?xml version="1.0"?>
        <hello>
          <world/>
        </hello>
        <!-- That was my document -->
      `);
      
      var doc = staxStringReader.buildDocument();
      var data = [
        {nodeType: 3},
        {nodeType: 8, sourceXml: "<!-- Here's my document -->" },
        {nodeType: 3},
        {nodeType: 7, sourceXml: '<?xml version="1.0"?>' },
        {nodeType: 3},
        {nodeType: 1, sourceXml: '<hello>' },
        {nodeType: 3},
        {nodeType: 8, sourceXml: "<!-- That was my document -->" },
        {nodeType: 3}
      ];
      var childNode, d, childNodes = doc.childNodes;
      expect(childNodes.length).toBe(data.length);
      for (var i = 0; i < childNodes.length; i++){
        d = data[i];
        childNode = childNodes.item(i);
        expect(childNode.nodeType).toBe(d.nodeType);
        if (d.sourceXml !== undefined) {
          expect(childNode.sourceXml).toBe(d.sourceXml);
        }
      }
    });

    it('Can iterate children of a document with a document element with nested element content', () => {
      var staxStringReader = new xmlazy.StaxStringReader(`
        <!-- Here's my document -->
        <?xml version="1.0"?>
        <hello>
          <america>
            <north-america/>
            <south-america/>
          </america>
          <europe>
            <west-europe/>
            <east-europe/>
          </europe>
          <antarctica/>
        </hello>
        <!-- That was my document -->
      `);
      
      var doc = staxStringReader.buildDocument();
      var data = [
        {nodeType: 3},
        {nodeType: 8, sourceXml: "<!-- Here's my document -->" },
        {nodeType: 3},
        {nodeType: 7, sourceXml: '<?xml version="1.0"?>' },
        {nodeType: 3},
        {nodeType: 1, sourceXml: '<hello>' },
        {nodeType: 3},
        {nodeType: 8, sourceXml: "<!-- That was my document -->" },
        {nodeType: 3}
      ];
      var childNode, d, childNodes = doc.childNodes;
      expect(childNodes.length).toBe(data.length);
      for (var i = 0; i < childNodes.length; i++){
        d = data[i];
        childNode = childNodes.item(i);
        expect(childNode.nodeType).toBe(d.nodeType);
        if (d.sourceXml !== undefined) {
          expect(childNode.sourceXml).toBe(d.sourceXml);
        }
      }
    });
    
  });

  describe('Document Element childNodes node list', () => {

    it('Can iterate children of simple shallow element', () => {
      var staxStringReader = new xmlazy.StaxStringReader(`
        <root>
          <!-- Here's my document -->
          <?xml version="1.0"?>
          <hello/>
          <!-- That was my document -->
        </root>
      `);
      
      var doc = staxStringReader.buildDocument();
      var docElement = doc.documentElement;
      var data = [
        {nodeType: 3},
        {nodeType: 8, sourceXml: "<!-- Here's my document -->" },
        {nodeType: 3},
        {nodeType: 7, sourceXml: '<?xml version="1.0"?>' },
        {nodeType: 3},
        {nodeType: 1, sourceXml: '<hello/>' },
        {nodeType: 3},
        {nodeType: 8, sourceXml: "<!-- That was my document -->" },
        {nodeType: 3}
      ]
      var childNode, d, childNodes = docElement.childNodes;
      expect(childNodes.length).toBe(data.length);
      for (var i = 0; i < childNodes.length; i++){
        d = data[i];
        childNode = childNodes.item(i);
        expect(childNode.nodeType).toBe(d.nodeType);
        if (d.sourceXml !== undefined) {
          expect(childNode.sourceXml).toBe(d.sourceXml);
        }
      }
    });
    
    it('Can iterate children of an element with text content', () => {
      var staxStringReader = new xmlazy.StaxStringReader(`
        <root>
          <!-- Here's my document -->
          <?xml version="1.0"?>
          <hello>
          </hello>
          <!-- That was my document -->
        </root>
      `);
      
      var doc = staxStringReader.buildDocument();
      var docElement = doc.documentElement;
      var data = [
        {nodeType: 3},
        {nodeType: 8, sourceXml: "<!-- Here's my document -->" },
        {nodeType: 3},
        {nodeType: 7, sourceXml: '<?xml version="1.0"?>' },
        {nodeType: 3},
        {nodeType: 1, sourceXml: '<hello>' },
        {nodeType: 3},
        {nodeType: 8, sourceXml: "<!-- That was my document -->" },
        {nodeType: 3}
      ];
      var childNode, d, childNodes = docElement.childNodes;
      expect(childNodes.length).toBe(data.length);
      for (var i = 0; i < childNodes.length; i++){
        d = data[i];
        childNode = childNodes.item(i);
        expect(childNode.nodeType).toBe(d.nodeType);
        if (d.sourceXml !== undefined) {
          expect(childNode.sourceXml).toBe(d.sourceXml);
        }
      }
    });
    
    it('Can iterate children of an element with element content', () => {
      var staxStringReader = new xmlazy.StaxStringReader(`
        <root>
          <!-- Here's my document -->
          <?xml version="1.0"?>
          <hello>
            <world/>
          </hello>
          <!-- That was my document -->
        </root>
      `);
      
      var doc = staxStringReader.buildDocument();
      var docElement = doc.documentElement;
      var data = [
        {nodeType: 3},
        {nodeType: 8, sourceXml: "<!-- Here's my document -->" },
        {nodeType: 3},
        {nodeType: 7, sourceXml: '<?xml version="1.0"?>' },
        {nodeType: 3},
        {nodeType: 1, sourceXml: '<hello>' },
        {nodeType: 3},
        {nodeType: 8, sourceXml: "<!-- That was my document -->" },
        {nodeType: 3}
      ];
      var childNode, d, childNodes = docElement.childNodes;
      expect(childNodes.length).toBe(data.length);
      for (var i = 0; i < childNodes.length; i++){
        d = data[i];
        childNode = childNodes.item(i);
        expect(childNode.nodeType).toBe(d.nodeType);
        if (d.sourceXml !== undefined) {
          expect(childNode.sourceXml).toBe(d.sourceXml);
        }
      }
    });

    it('Can iterate children of an element with nested element content', () => {
      var staxStringReader = new xmlazy.StaxStringReader(`
        <root>
          <!-- Here's my document -->
          <?xml version="1.0"?>
          <hello>
            <america>
              <north-america/>
              <south-america/>
            </america>
            <europe>
              <west-europe/>
              <east-europe/>
            </europe>
            <antarctica/>
          </hello>
          <!-- That was my document -->
        </root>
      `);
      
      var doc = staxStringReader.buildDocument();
      var docElement = doc.documentElement;
      var data = [
        {nodeType: 3},
        {nodeType: 8, sourceXml: "<!-- Here's my document -->" },
        {nodeType: 3},
        {nodeType: 7, sourceXml: '<?xml version="1.0"?>' },
        {nodeType: 3},
        {nodeType: 1, sourceXml: '<hello>' },
        {nodeType: 3},
        {nodeType: 8, sourceXml: "<!-- That was my document -->" },
        {nodeType: 3}
      ];
      var childNode, d, childNodes = docElement.childNodes;
      expect(childNodes.length).toBe(data.length);
      for (var i = 0; i < childNodes.length; i++){
        d = data[i];
        childNode = childNodes.item(i);
        expect(childNode.nodeType).toBe(d.nodeType);
        if (d.sourceXml !== undefined) {
          expect(childNode.sourceXml).toBe(d.sourceXml);
        }
      }
    });
    
  });

  
});
