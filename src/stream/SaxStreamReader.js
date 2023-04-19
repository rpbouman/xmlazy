import { StaxStringReader } from '../stax/StaxStringReader.js';
import { TEXT_NODE } from '../dom/DomNodeTypes.js';
import { DecoderUtils } from '../decoder/DecoderUtils.js';

var decoderUtils;

var SaxStreamReader = function(options){
  if (!options){
    this.lastError = new Error('Configuration error: no configuration provided');
    throw this.lastError;
  }
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
    // no text decoder means the stream returns strings, or that we should guess the encoding
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
  normalizeBufferedTextNodes: function(textNodeBuffer){
    let textNode;
    switch (textNodeBuffer.length){
      case 0:
        textNode =  null;
        break;
      case 1:
        textNode = textNodeBuffer[0];
        break;
      default:
        var text = textNodeBuffer.reduce(function(acc, curr){
          acc += curr.nodeValue;
          return acc;
        }, '');

        textNode = textNodeBuffer[0];
        textNode.s = text;
        textNode.b = 0;
        textNode.E = text.length;
    }

    textNodeBuffer.length = 0;
    return textNode;
  },
  parseAndCallback: function(options) {
    options = Object.assign({}, this.options, options);
    var reader = options.reader || this.options.reader;
    
    var textDecoder;
    if (options.textDecoder) {
      textDecoder = options.textDecoder;
    }
    else
    if (typeof options.encoding === 'string') {
      textDecoder = new TextDecoder(options.encoding);
    }
    
    var saxHandler = options.saxHandler || this.options.saxHandler;
    var staxStringReader = options.staxStringReader || this.options.staxStringReader || new StaxStringReader('', {
      saxHandler: saxHandler
    });
    staxStringReader.setSaxHandler(saxHandler);
    var staxResult;
    var textNodeBuffer = [];

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
      var handleChunkRead = (function(readerResult){
        var textNode;
        if (readerResult.done === true) {
          textNode = this.normalizeBufferedTextNodes(textNodeBuffer);
          if (textNode !== null) {
            if (saxHandler.call(null, textNode) === false) {
              resolve(true);
              return;
            }
            textNode = null;
          }
          saxHandler.call(null, {nodeType: -staxStringReader.baseNode.DOCUMENT_NODE});
          resolve(true);
          return;
        }

        var string, chunk = readerResult.value;
        
        if (!textDecoder && typeof chunk !== 'string') {
          if (chunk instanceof Uint8Array) {
            if (!decoderUtils) {
              decoderUtils = new DecoderUtils();
            }
            textDecoder = decoderUtils.createDecoderForXml(chunk);
          }
          else {
            reject(new Error(`Cannot handle chunk of type ${typeof chunk}.`));
            return;
          }
        }
        
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
        if (typeof chunk === 'string'){
          string = chunk;
        }
        else {
          reject(new Error(`Cannot handle chunk of type ${typeof chunk}.`));
          return;
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

        try {
          do {
            staxResult = staxStringReader.next();
            if (staxResult.done === true) {
              break;
            }
            var staxNode = staxResult.value;
            
            if (staxNode.nodeType === TEXT_NODE){
              textNodeBuffer.push(staxNode);
            }
            else {
              textNode = this.normalizeBufferedTextNodes(textNodeBuffer);
              if (textNode !== null) {
                if (saxHandler.call(null, textNode) === false) {
                  resolve(true);
                  return;
                }
                textNode = null;
              }
              if (saxHandler.call(null, staxNode) === false){
                resolve(true);
                return;
              }
            }
          } while (staxResult);
          
        }
        catch (e) {
          if (e.isFatal !== false) {
            reject(e);
            return;
          }
        }
        doRead();
      }.bind(this));

      var doRead = function(){
        reader.read().then(handleChunkRead);
      };

      if (saxHandler.call(null, staxStringReader.getDocumentNode()) === false) {
        resolve(true);
      }
      else {
        doRead();
      }
    }.bind(this));
  }
};

export { SaxStreamReader };