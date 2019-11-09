import * as xmlazy from '../../src/xmlazy.js';

describe('StaxStringReader', () => {
  
  it('Can instantiate a StaxStringReader', () => {
    var StaxStringReader = new xmlazy.StaxStringReader('');
    expect(StaxStringReader).toBeDefined();
  });

  describe('Detect open element tags that miss their >', () => {
    it('Without attributes', () => {
      var staxStringReader = new xmlazy.StaxStringReader('<hello');
      expect(()=>{
        staxStringReader.next();
      }).toThrow('Unclosed element startag');
    });
    it('With attribute', () => {
      var staxStringReader = new xmlazy.StaxStringReader('<hello att="value" ');
      expect(()=>{
        staxStringReader.next();
      }).toThrow('Unclosed element startag');
    });
    it('With attributevalue containing > in ', () => {
      var staxStringReader = new xmlazy.StaxStringReader('<hello att="value>" ');
      expect(()=>{
        staxStringReader.next();
        staxStringReader.next();
      }).toThrow('Non-whitespace content found after the document element');
    });
  });
  
});
