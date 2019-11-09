import * as xmlazy from '../../src/xmlazy.js';

describe('Error tests', () => {

  describe('Content after document element.', () => {
    
    it('Throws a CONTENT_FOUND_AFTER_DOCUMENT_ELEMENT_PARSE_EXCEPTION error when it encounters content after the document element.', ()=>{
      const xml = `
        <root>
        </root>
        
        x
      `;
      const staxStringReader = new xmlazy.StaxStringReader(xml);
      const staxError = staxStringReader.CONTENT_FOUND_AFTER_DOCUMENT_ELEMENT_PARSE_EXCEPTION;
      expect(staxError).toBeDefined();
      try {
        while (!(staxStringReader.next()).done) {};
        throw new Error('StaxStringReader did not throw.');
      }
      catch (ex) {
        expect(ex.message).toBe(staxError);
        expect(ex.isFatal).toBe(false);
      }
    });

  });
  
  describe('Dangling < at end of input.', () => {
    
    it('Throws a DANGLING_LESS_THAN_PARSE_EXCEPTION error when the input ends with a <', ()=>{
      const xml = `
        <root>
        <`;
      const staxStringReader = new xmlazy.StaxStringReader(xml);
      const staxError = staxStringReader.DANGLING_LESS_THAN_PARSE_EXCEPTION;
      expect(staxError).toBeDefined();
      try {
        while (!(staxStringReader.next()).done) {};
        throw new Error('StaxStringReader did not throw.');
      }
      catch (ex) {
        expect(ex.message).toBe(staxError);
        expect(ex.isFatal).toBe(false);
      }
    });

  });

  describe('Unclosed end tag.', () => {
    
    it('Throws a UNCLOSED_END_TAG_PARSE_EXCEPTION error when the input ends with an unclosed end tab.', ()=>{
      const xml = `
        <root>
        </root`;
      const staxStringReader = new xmlazy.StaxStringReader(xml);
      const staxError = staxStringReader.UNCLOSED_END_TAG_PARSE_EXCEPTION;
      expect(staxError).toBeDefined();
      try {
        while (!(staxStringReader.next()).done) {};
        throw new Error('StaxStringReader did not throw.');
      }
      catch (ex) {
        expect(ex.message).toBe(staxError);
        expect(ex.isFatal).toBe(false);
      }
    });

  });

  describe('Malformed document type.', () => {
    
    it('Throws a MALFORMED_DOCTYPE_DECLARATION_PARSE_EXCEPTION error when the input has a doctype that is malformed (no internal subset).', ()=>{
      const xml = `
        <!DOCTYPE greeting SYSTEM "hello.dtd>
        <root>
        </root>`;
      const staxStringReader = new xmlazy.StaxStringReader(xml);
      const staxError = staxStringReader.MALFORMED_DOCTYPE_DECLARATION_PARSE_EXCEPTION;
      expect(staxError).toBeDefined();
      try {
        while (!(staxStringReader.next()).done) {};
        throw new Error('StaxStringReader did not throw.');
      }
      catch (ex) {
        expect(ex.message).toBe(staxError);
        expect(ex.isFatal).toBe(false);
      }
    });
  });

  describe('Malformed document type.', () => {
    it('Throws a MALFORMED_DOCTYPE_DECLARATION_PARSE_EXCEPTION error when the input has a doctype that is malformed (internal subset).', ()=>{
      const xml = `
        <?xml version="1.0" encoding="UTF-8" ?>
        <!DOCTYPE greeting [
          <!ELEMENT greeting (#PCDATA)
        ]>
        <greeting>Hello, world!</greeting>
      `;
      const staxStringReader = new xmlazy.StaxStringReader(xml);
      const staxError = staxStringReader.MALFORMED_DOCTYPE_DECLARATION_PARSE_EXCEPTION;
      expect(staxError).toBeDefined();      
      try {
        while (!(staxStringReader.next()).done) {};
        throw new Error('StaxStringReader did not throw.');
      }
      catch (ex) {
        expect(ex.message).toBe(staxStringReader.MALFORMED_DOCTYPE_DECLARATION_PARSE_EXCEPTION);
        expect(ex.isFatal).toBe(false);
      }
    });
  });

  describe('Expected commment, cdata section or document type declaration.', () => {
    it('Throws a EXPECTED_COMMENT_CDATA_DOCTYPE_PARSE_ERROR error when the input has a tag starting with <! that is not a comment, cdata section or doctype declaration.', ()=>{
      const xml = `
        <?xml version="1.0" encoding="UTF-8" ?>
        <!
        <greeting>Hello, world!</greeting>
      `;
      const staxStringReader = new xmlazy.StaxStringReader(xml);
      const staxError = staxStringReader.EXPECTED_COMMENT_CDATA_DOCTYPE_PARSE_ERROR;
      expect(staxError).toBeDefined();      
      try {
        while (!(staxStringReader.next()).done) {};
        throw new Error('StaxStringReader did not throw.');
      }
      catch (ex) {
        expect(ex.message).toBe(staxError);
        expect(ex.isFatal).toBe(true);
      }
    });
  });

  describe('Unclosed comment.', () => {
    it('Throws a UNCLOSED_COMMENT_PARSE_EXCEPTION error when the input has an unclosed comment.', ()=>{
      const xml = `
        <?xml version="1.0" encoding="UTF-8" ?>
        <!--
        <greeting>Hello, world!</greeting>
      `;
      const staxStringReader = new xmlazy.StaxStringReader(xml);
      const staxError = staxStringReader.UNCLOSED_COMMENT_PARSE_EXCEPTION;
      expect(staxError).toBeDefined();      
      try {
        while (!(staxStringReader.next()).done) {};
        throw new Error('StaxStringReader did not throw.');
      }
      catch (ex) {
        expect(ex.message).toBe(staxError);
        expect(ex.isFatal).toBe(false);
      }
    });
  });

  describe('Unclosed cdata section.', () => {
    it('Throws a UNCLOSED_CDATA_PARSE_EXCEPTION error when the input has an unclosed CDATA section.', () => {
      const xml = `
        <?xml version="1.0" encoding="UTF-8" ?>
        <![CDATA[ 
        <greeting>Hello, world!</greeting>
      `;
      const staxStringReader = new xmlazy.StaxStringReader(xml);
      const staxError = staxStringReader.UNCLOSED_CDATA_PARSE_EXCEPTION;
      expect(staxError).toBeDefined();      
      try {
        while (!(staxStringReader.next()).done) {};
        throw new Error('StaxStringReader did not throw.');
      }
      catch (ex) {
        expect(ex.message).toBe(staxError);
        expect(ex.isFatal).toBe(false);
      }
    });
  });

  describe('Unclosed processing instruction.', () => {
    it('Throws a UNCLOSED_PROCESSING_INSTRUCTION_PARSE_EXCEPTION error when the input has an unclosed processing instruction.', ()=>{
      const xml = `
        <?xml version="1.0" encoding="UTF-8" ?
        <greeting>Hello, world!</greeting>
      `;
      const staxStringReader = new xmlazy.StaxStringReader(xml);
      const staxError = staxStringReader.UNCLOSED_PROCESSING_INSTRUCTION_PARSE_EXCEPTION;
      expect(staxError).toBeDefined();      
      try {
        while (!(staxStringReader.next()).done) {};
        throw new Error('StaxStringReader did not throw.');
      }
      catch (ex) {
        expect(ex.message).toBe(staxError);
        expect(ex.isFatal).toBe(false);
      }
    });
  });

  describe('Unclosed element start tag.', () => {
    it('Throws a UNCLOSED_ELEMENT_START_TAG_PARSE_EXCEPTION error when the input has an unclosed element start tag at the end.', ()=>{
      const xml = `
        <?xml version="1.0" encoding="UTF-8" ?>
        <greeting
      `;
      const staxStringReader = new xmlazy.StaxStringReader(xml);
      const staxError = staxStringReader.UNCLOSED_ELEMENT_START_TAG_PARSE_EXCEPTION;
      expect(staxError).toBeDefined();      
      try {
        while (!(staxStringReader.next()).done) {};
        throw new Error('StaxStringReader did not throw.');
      }
      catch (ex) {
        expect(ex.message).toBe(staxError);
        expect(ex.isFatal).toBe(false);
      }
    });

    it('Throws a UNCLOSED_ELEMENT_START_TAG_PARSE_ERROR error when the input has an unclosed element but there are more tags after.', ()=>{
      const xml = `
        <?xml version="1.0" encoding="UTF-8" ?>
        <greeting</greeting>       
      `;
      const staxStringReader = new xmlazy.StaxStringReader(xml);
      const staxError = staxStringReader.UNCLOSED_ELEMENT_START_TAG_PARSE_ERROR;
      expect(staxError).toBeDefined();      
      try {
        while (!(staxStringReader.next()).done) {};
        throw new Error('StaxStringReader did not throw.');
      }
      catch (ex) {
        expect(ex.message).toBe(staxError);
        expect(ex.isFatal).toBe(true);
      }
    });
  });

  
});
