import { StaxStringReader } from '../stax/StaxStringReader.js';

var SaxStreamReader = function(options){
  this.options = options;
  if (options.reader) {
    this.reader = options.reader;
  }
  else {
    this.state = this.STATE_FATAL_ERROR;
    this.lastError = new Error('Configuration error: no reader provided');
    throw this.lastError;
  }
  if (options.saxHandler) {
    this.saxHandler = options.saxHandler;
    this.staxStringReader = new StaxStringReader();
  }
  else {
    this.state = this.STATE_FATAL_ERROR;
    this.lastError = new Error('Configuration error: no saxHandler provided');
    throw this.lastError;
  }
    
  if (options.textDecoder) {
    // this means the stream returns something that is not a string (presumably, bytes), 
    // which need to be decoded first by this text decoder.
    this.textDecoder = options.textDecoder;
  }
  else {
    // no text decoder means the stream returns strings. not an error.
  }
  
  //ok, ready to parse some xml.
  this.state = this.STATE_NOT_STARTED;
};

SaxStreamReader.prototype = {
  STATE_NOT_STARTED: 0,
  STATE_BUSY: 1,
  STATE_PAUSED: 2,
  STATE_NON_FATAL_ERROR: 3, 
  STATE_FATAL_ERROR: 4,
  STATE_DONE: 5,  
  parseAndCallback: function(){
    var reader = this.reader;
    var textDecoder = this.textDecoder;
    var staxStringReader = this.staxStringReader;
    var saxHandler = this.saxHandler;
    var saxHandlerResult; 
    var staxResult;
    return new Promise(function(resolve, reject){
      switch (this.state){ 
        case this.STATE_NOT_STARTED:
        case this.STATE_PAUSED:
          if (this.STATE_PAUSED) {
            try {
              while (!(staxResult = staxStringReader.next()).done){
                saxHandlerResult = saxHandler.call(null, staxResult.result);
                
              }
            } 
            catch(exception){
              if (exception.isFatal) {
                this.lastError = exception;
                this.state = this.STATE_FATAL_ERROR;
                reject({
                  state: this.state,
                  error: this.lastError
                });
              }
              else {
              }
            }
          }
          // if ok: read the first chunk from the stream. Check the result.
          // is it done already? then probably reject (empty document)          
          // if not, 
          // check if the text decoder is set, if it is, decode chunk to text.
          // call the handler, send a document node.
          // set our state to BUSY
          // in a loop, call next on the stax reader, and notify the handler.
          // case:
          //    handler returns false:
          //      set state to paused. resolve.
          //    stax reader throws error.
          //      if the error is fatal, set state to fatal error. reject.
          //      if the error is not fatal, read another chunk.
          //    current chunk is consumed
          //      read another chunk.
          break;
        case this.STATE_FATAL_ERROR:
          // reject. 
          // A previous parse encountered a fatal error and we cannot proceed.
          reject({
            state: this.state,
            error: this.lastError
          });
          break;
        case this.STATE_DONE:
          // reject. 
          // A previous parse consumed all of the stream and we cannot proceed.
          reject({
            state: this.state
          });
          break;
        default: 
          reject({
            state: this.state,
            error: new Error('Illegal state.')
          });
      }
    }.bind(this));
  },
  parseAndCallback: function(options) {
    var reader = options.reader || this.options.reader;
    var textDecoder = options.textDecoder || this.options.textDecoder;
    var saxHandler = options.saxHandler || this.options.saxHandler;
    var staxStringReader = options.staxStringReader || this.options.staxStringReader || new StaxStringReader('', {
      saxHandler: saxHandler
    });
    staxStringReader.setSaxHandler(saxHandler); 
    var staxResult;
    
    return new Promise(function(resolve, reject){
      if (!reader) {
        reject(new Error('No reader specified.'));
        return;
      }
      if (!saxHandler) {
        reject(new Error('No SAX handler  specified.'));
        return;
      }
      var spareBytes;
      var handleChunkRead = function(readerResult){
        if (readerResult.done === true) {
          saxHandler.call(null, {nodeType: -staxStringReader.baseNode.DOCUMENT_NODE});
          resolve(true);
          return;
        }
        
        var string, chunk = readerResult.value;
        if (textDecoder) {  // the reader is returning raw bytes, we have to decode them
          if (spareBytes && spareBytes.length) {
            var newChunk = new Uint8Array(spareBytes.length + chunk.length);
            newChunk.set(spareBytes, 0);
            newChunk.set(chunk, spareBytes.length);
            chunk = newChunk;
            newChunk = null;
          }
          string = textDecoder.decode(chunk);
          // maybe we received a chunk halfway a multi-byte character - let's check that
          var n = string.length - 1;
          for (var i = n; i >= 0; i--) {
            //REPLACEMENT CHARACTER, see https://en.wikipedia.org/wiki/Specials_(Unicode_block)
            if (string.charCodeAt(i) !== 0xFFFD) { 
              break;
            }
          }
          // 
          if (n - i > 0) {
            spareBytes = chunk.slice(i);
            string = string.slice(0, -spareBytes.length);
          }
          else {
            spareBytes = undefined;
          }
        }
        else 
        if (typeof chunk !== 'string'){
          reject(new Error(`Cannot handle chunk of type ${typeof chunk}.`));
          return;
        }
        else {          
          string = chunk;          
        }
        chunk = null;
        if (staxStringReader.index < staxStringReader.string.length) {
          var stringLeft = staxStringReader.string.substr(staxStringReader.index);
          var newString = stringLeft + string;
          string = newString;
        }
        staxStringReader.setString(string);
        string = null;
        newString = null;
        (function(){
          try {
            // eslint-disable-next-line no-cond-assign
            while (!(staxResult = staxStringReader.next()).done) {
              saxHandler.call(null, staxResult.value);
            }
          } 
          catch (e) {
            if (e.isFatal !== false) {
              reject(e);
              return;
            }
          }
          doRead();
        })();
      };
      
      var doRead = function(){
        reader.read().then(handleChunkRead);
      };
      doRead();
    }.bind(this));
  }
};

export { SaxStreamReader };