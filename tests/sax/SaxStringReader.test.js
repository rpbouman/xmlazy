import * as xmlazy from '../../src/xmlazy.js';

describe('SaxStringReader', () => {
  
  it('Can instantiate a SaxStringReader', () => {
    var saxStringReader = new xmlazy.SaxStringReader('');
    expect(saxStringReader).toBeDefined();
  });

  describe('Detect open element tags that miss their >', () => {
    it('Without attributes', () => {
      var saxStringReader = new xmlazy.SaxStringReader('<hello');
      expect(()=>{
        saxStringReader.next();
      }).toThrow('Unclosed element startag');
    });
    it('With attribute', () => {
      var saxStringReader = new xmlazy.SaxStringReader('<hello att="value" ');
      expect(()=>{
        saxStringReader.next();
      }).toThrow('Unclosed element startag');
    });
    it('With attributevalue containing > in ', () => {
      var saxStringReader = new xmlazy.SaxStringReader('<hello att="value>" ');
      expect(()=>{
        saxStringReader.next();
        saxStringReader.next();
      }).toThrow('Non-whitespace content found after the document element');
    });
  });
  
});
