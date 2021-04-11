import * as xmlazy from '../../src/xmlazy.js';

const ArrayStoreSaxHandler = function(){
  this.nodes = [];
};
ArrayStoreSaxHandler.prototype = {
  handleStaxEvent: function(staxNode){
    this.nodes.push({
      nodeType: staxNode.nodeType,
      sourceXml: staxNode.nodeType === staxNode.DOCUMENT_NODE ? undefined : staxNode.sourceXml
    });
  },
  getNodes: function(){
    return this.nodes.map(node => {
      return {
        nodeType: node.nodeType,
        sourceXml: node.nodeType === 9 ? null : node.sourceXml
      }
    });
  },
};

const StringReader = function(string, chunkSize){
  this.string = string;
  this.chunkSize = chunkSize || 65535;
  this.index = 0;
}

StringReader.prototype = {
  read: function(){
    
    const index = this.index;
    const string = this.string;
    const stringLength = string.length;
    const chunkSize = this.chunkSize;
    
    return new Promise(function(resolve, reject){
      if (index < stringLength) {        
        let newIndex = index + chunkSize;
        if (newIndex > stringLength) {
          newIndex = stringLength;
        }
        resolve({
          done: false, 
          value: string.slice(index, newIndex)
        });
        this.index = newIndex;
      }
      else {
        resolve({done: true, value: undefined});
      }
    }.bind(this));
  }
};

describe('StringReader', () => {
  
  it('String reader chunks up string in 5 char chunks', done => {
    const chunks = [
      '01234',
      'abcde',
      'fghij',
      '56789'
    ];
    const readChunks = [];
    const stringReader =  new StringReader(chunks.join(''), 5);
    let i = 0, readerResult;
    
    
    const read = function(){
      stringReader.read().then(function(readerResult){
        if (readerResult.done) {
          expect(readChunks).toEqual(chunks);
          done();
        }
        else {
          readChunks.push(readerResult.value);
          read();
        }
      })
    };
    read();
    
  });

});

describe('SaxStreamReader', () => {  
  
  const err= new Error();
  const xmlString = `
    <?xml version="1.0"?>
    <documentElement>
      <childElement>
      TextContent
      </childElement>
      More text content.
    </documentElement>
  `;
  const handler1 = new ArrayStoreSaxHandler();
  const staxStringReader = new xmlazy.StaxStringReader({
    saxHandler: handler1.handleStaxEvent.bind(handler1)
  });
  staxStringReader.parseAndCallback(xmlString);

  const xmlStringReader = new StringReader(xmlString, 10);
  const handler2 = new ArrayStoreSaxHandler();
  const saxStreamReader = new xmlazy.SaxStreamReader({
    reader: xmlStringReader,
    saxHandler: handler2.handleStaxEvent.bind(handler2)
  });
  
  it('sax parsing a stream gives same result as sax parsing a string', done => {
    staxStringReader.parseAndCallback(xmlString);
    saxStreamReader.parseAndCallback(xmlStringReader).then(function(){
      console.log(JSON.stringify(handler1.getNodes()));
      console.log(JSON.stringify(handler2.getNodes()));
      expect(handler1.getNodes()).toEqual(handler2.getNodes());
    });
  });

});
