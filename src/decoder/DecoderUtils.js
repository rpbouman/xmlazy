import { StaxStringReader } from '../stax/StaxStringReader.js';

var DecoderUtils;

(DecoderUtils = function(){
}).prototype = {
  guessEncoding: function(uint8Array){
    // https://developer.mozilla.org/en-US/docs/Web/API/TextDecoder/encoding
    // https://developer.mozilla.org/en-US/docs/Web/API/Encoding_API/Encodings
    
    // Goal is to create a text decoder based on the stream content
    // The xml declaration's encoding parameter would ideally declare the encoding,
    // but the problem is that reading and parsing the xml declaration already presumes a character encoding.
    // the xml spec addresses this issue in a non-normatieve section:
    // https://www.w3.org/TR/xml/#sec-guessing
    // this provides a recipe that would allow us to make a good enough guess for the encoding based on reading at most 4 bytes
    // this initial encoding would be sufficient to read and parse the xml declaration.
    // once we read the xml declaration we will know whether an encoding was specified.
    // if it is specified, we should assume that encoding for the rest of the document.

    // initially, it could be any of these encodings
    var byteStates = {
      0x00: {
        0x00: {
          0x00: {
            0x3c: {
              encoding: 'ucs4-1234',
              bom: false
            }
          },
          0x3C: {
            0x00: {
              encoding: 'ucs4-2143',
              bom: false
            }
          },
          0xFE: {
            0xFF: {
              encoding: 'ucs4-1234',
              bom: true
            }
          },
          0xFF: {
            0xFE: {
              encoding: 'ucs4-2143',
              bom: true
            }
          }
        },
        0x3C: {
          0x00: {
            0x00: {
              encoding: 'ucs4-3412',
              bom: false
            },
            0x3F: {
              encoding: 'utf-16be',
              bom: false
            }
          }
        }
      },
      0x3C: {
        0x00: {
          0x00: {
            0x00: {
              encoding: 'ucs4-4321',
              bom: false
            }
          },
          0x3F: {
            0x00: {
              encoding: 'utf-16le',
              bom: false
            }
          }
        },
        0x3F: {
          0x78: {
            0x6D: {
              encoding: 'utf-8',
              bom: false
            }
          }
        }
      },
      0x4C: {
        0x6F:{
          0xA7: {
            0x94: {
              encoding: 'ebcdic',
              bom: false
            }
          }
        }
      },
      0xEF: {
        0xBB: {
          0xBF: {
            encoding: 'utf-8',
            bom: true
          }
        }
      },
      0xFE: {
        0xFF: {
          0x00: {
            0x00: {
              encoding: 'ucs4-3412',
              bom: true
            },
            default: {
              encoding: 'utf-16be',
              bom: true
            }
          },
          default: {
            encoding: 'utf-16be',
            bom: true
          }
        }
      },
      0xFF: {
        0xFE: {
          0x00: {
            0x00: {
              encoding: 'ucs4-4321',
              bom: true
            }
          },
          default: {
            encoding: 'utf-16le',
            bom: true
          }
        }
      }
    };
    
    var byteState = byteStates, newByteState;
    var tmpEncoding;
    for (var i = 0; i < Math.min(uint8Array.length, 4); i++){
      var b = String(uint8Array[i]);
      newByteState = byteState[b];
      if (newByteState === undefined) {
        if (byteState['default']){
          newByteState = byteState['default'];
          tmpEncoding = newByteState.encoding;
        }
        else {
          tmpEncoding = 'utf-8';
        }
        break;
      }
      else 
      if (newByteState.encoding !== undefined){
        tmpEncoding = newByteState.encoding;
        break;
      }
      byteState = newByteState;
    }
    
    return tmpEncoding;
  },
  createDecoderForXml: function(uint8Array){
    var tmpEncoding = this.guessEncoding(uint8Array);
    switch(tmpEncoding){
      case 'utf-8':
      case 'utf-16be':
      case 'utf-16le':
        break;
      case 'ebcdic':
      case 'ucs4-1234':
      case 'ucs4-2143':
      case 'ucs4-3412':
      case 'ucs4-4321':
        throw new Error('Guessed ${tmpEncoding} encoding. Currently not supported');
      default:
        tmpEncoding = 'utf-8';
    }
    const tempDecoder = this.createDecoder(tmpEncoding);
    const string = tempDecoder.decode(uint8Array);
    const tempStaxStringReader = new StaxStringReader(string);
    
    const result = tempStaxStringReader.next();
    if (result.done){
      return tempDecoder;
    }
    const node = result.value;
    if (node.nodeType !== node.PROCESSING_INSTRUCTION_NODE) {
      return tempDecoder;
    }
    if (node.target !== 'xml'){
      return tempDecoder;
    }
    const content = node.data;
    const match = /\bencoding\s*=\s*("([^"]+)"|'([^']+)')/.exec(content);
    if (!match){
      return tempDecoder;
    }
    const encoding = match[2] || match[3];
    if (encoding === tmpEncoding){
      return tempDecoder;
    }
    try {
      const decoder = this.createDecoder(encoding);
      return decoder;
    }
    catch(e){
      throw new Error(`Cannot create text decoder for encoding ${encoding} specified by XML declaration.`);
    }
  },
  createDecoder: function(encoding, options){
    if (arguments.length > 2){
      throw new Error('Illegal number of arguments');
    }
    switch (typeof encoding){
      case 'undefined':
        switch (typeof options){
          case 'object':
            return new TextDecoder(options);
          case 'undefined':
            return new TextDecoder();
          default:
            throw new Error('Invalid arguments');
        }
      case 'string':
        switch (typeof options){
          case 'object':
            return new TextDecoder(encoding, options);
          case 'undefined':
            return new TextDecoder(encoding);
        }
        break;
      case 'object':
        if (typeof options !== 'undefined'){
          throw new Error('Invalid arguments');
        }
        break;
      default:
        throw new Error('Invalid arguments');
    }
  }
};

export { DecoderUtils };