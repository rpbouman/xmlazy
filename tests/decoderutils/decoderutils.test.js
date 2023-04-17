const fs = require('fs');
const path = require('path');

import * as xmlazy from '../../src/xmlazy.js';

const startdir = 'files';

describe('DecoderUtils', () => {

  it('Can instantiate DecoderUtils', () => {
    expect(typeof xmlazy.DecoderUtils).toBe('function');
    const decoderUtils = new xmlazy.DecoderUtils();
    expect(decoderUtils instanceof xmlazy.DecoderUtils).toBe(true);
  });
  
  if (xmlazy.DecoderUtils) {
    describe('guess encoding with BOM', () => {
      const decoderUtils = new xmlazy.DecoderUtils();

      it('Can guess UCS-4, big-endian machine (1234 order)', () => {
        const uint8Array = new Uint8Array(4);
        uint8Array[0] = 0x00;
        uint8Array[1] = 0x00;
        uint8Array[2] = 0xFE;
        uint8Array[3] = 0xFF;
        
        const encoding = decoderUtils.guessEncoding(uint8Array);
        expect(encoding).toBe('ucs4-1234');
      });
      
      it('Can guess UCS-4, little-endian machine (4321 order)', () => {
        const uint8Array = new Uint8Array(4);
        uint8Array[0] = 0xFF;
        uint8Array[1] = 0xFE;
        uint8Array[2] = 0x00;
        uint8Array[3] = 0x00;
        
        const encoding = decoderUtils.guessEncoding(uint8Array);
        expect(encoding).toBe('ucs4-4321');
      });

      it('Can guess UCS-4, unusual octet order (2143)', () => {
        const uint8Array = new Uint8Array(4);
        uint8Array[0] = 0x00;
        uint8Array[1] = 0x00;
        uint8Array[2] = 0xFF;
        uint8Array[3] = 0xFE;
        
        const encoding = decoderUtils.guessEncoding(uint8Array);
        expect(encoding).toBe('ucs4-2143');
      });
      
      it('Can guess UCS-4, unusual octet order (3412)', () => {
        const uint8Array = new Uint8Array(4);
        uint8Array[0] = 0xFE;
        uint8Array[1] = 0xFF;
        uint8Array[2] = 0x00;
        uint8Array[3] = 0x00;
        
        const encoding = decoderUtils.guessEncoding(uint8Array);
        expect(encoding).toBe('ucs4-3412');
      });

      it('Can guess UTF-16, big-endian', () => {
        const uint8Array = new Uint8Array(4);
        uint8Array[0] = 0xFE;
        uint8Array[1] = 0xFF;
        uint8Array[2] = 0x01;
        uint8Array[3] = 0x01;
        
        const encoding = decoderUtils.guessEncoding(uint8Array);
        expect(encoding).toBe('utf-16be');
      });

      it('Can guess UTF-16, big-endian', () => {
        const uint8Array = new Uint8Array(4);
        uint8Array[0] = 0xFE;
        uint8Array[1] = 0xFF;
        uint8Array[2] = 0x00;
        uint8Array[3] = 0x3C;
        
        const encoding = decoderUtils.guessEncoding(uint8Array);
        expect(encoding).toBe('utf-16be');
      });

      it('Can guess UTF-16, little-endian', () => {
        const uint8Array = new Uint8Array(4);
        uint8Array[0] = 0xFF;
        uint8Array[1] = 0xFE;
        uint8Array[2] = 0x01;
        uint8Array[3] = 0x01;
        
        const encoding = decoderUtils.guessEncoding(uint8Array);
        expect(encoding).toBe('utf-16le');
      });

      it('Can guess UTF-16, little-endian', () => {
        const uint8Array = new Uint8Array(4);
        uint8Array[0] = 0xFF;
        uint8Array[1] = 0xFE;
        uint8Array[2] = 0x3C;
        uint8Array[3] = 0x00;
        
        const encoding = decoderUtils.guessEncoding(uint8Array);
        expect(encoding).toBe('utf-16le');
      });

      it('Can guess UTF-8', () => {
        const uint8Array = new Uint8Array(4);
        uint8Array[0] = 0xEF;
        uint8Array[1] = 0xBB;
        uint8Array[2] = 0xBF;
        uint8Array[3] = 0x01;
        
        const encoding = decoderUtils.guessEncoding(uint8Array);
        expect(encoding).toBe('utf-8');
      });
      
    });
    
    describe('guess encoding without BOM', () => {
      const decoderUtils = new xmlazy.DecoderUtils();

      it('Can guess UCS-4, big-endian machine (1234 order)', () => {
        const uint8Array = new Uint8Array(4);
        uint8Array[0] = 0x00;
        uint8Array[1] = 0x00;
        uint8Array[2] = 0x00;
        uint8Array[3] = 0x3C;
        
        const encoding = decoderUtils.guessEncoding(uint8Array);
        expect(encoding).toBe('ucs4-1234');
      });
      
      it('Can guess UCS-4, little-endian machine (4321 order)', () => {
        const uint8Array = new Uint8Array(4);
        uint8Array[0] = 0x3C;
        uint8Array[1] = 0x00;
        uint8Array[2] = 0x00;
        uint8Array[3] = 0x00;
        
        const encoding = decoderUtils.guessEncoding(uint8Array);
        expect(encoding).toBe('ucs4-4321');
      });

      it('Can guess UCS-4, unusual octet order (2143)', () => {
        const uint8Array = new Uint8Array(4);
        uint8Array[0] = 0x00;
        uint8Array[1] = 0x00;
        uint8Array[2] = 0x3C;
        uint8Array[3] = 0x00;
        
        const encoding = decoderUtils.guessEncoding(uint8Array);
        expect(encoding).toBe('ucs4-2143');
      });
      
      it('Can guess UCS-4, unusual octet order (3412)', () => {
        const uint8Array = new Uint8Array(4);
        uint8Array[0] = 0x00;
        uint8Array[1] = 0x3C;
        uint8Array[2] = 0x00;
        uint8Array[3] = 0x00;
        
        const encoding = decoderUtils.guessEncoding(uint8Array);
        expect(encoding).toBe('ucs4-3412')
      });

      it('Can guess UTF-16, big-endian', () => {
        const uint8Array = new Uint8Array(4);
        uint8Array[0] = 0x00;
        uint8Array[1] = 0x3C;
        uint8Array[2] = 0x00;
        uint8Array[3] = 0x3F;
        
        const encoding = decoderUtils.guessEncoding(uint8Array);
        expect(encoding).toBe('utf-16be');
      });

      it('Can guess UTF-16, little-endian', () => {
        const uint8Array = new Uint8Array(4);
        uint8Array[0] = 0x3C;
        uint8Array[1] = 0x00;
        uint8Array[2] = 0x3F;
        uint8Array[3] = 0x00;
        
        const encoding = decoderUtils.guessEncoding(uint8Array);
        expect(encoding).toBe('utf-16le')
      });
      
      it('Can guess UTF-8', () => {
        const uint8Array = new Uint8Array(4);
        uint8Array[0] = 0x3C;
        uint8Array[1] = 0x3F;
        uint8Array[2] = 0x78;
        uint8Array[3] = 0x6D;
        
        const encoding = decoderUtils.guessEncoding(uint8Array);
        expect(encoding).toBe('utf-8');
      });

      it('Can guess ebcdic', () => {
        const uint8Array = new Uint8Array(4);
        uint8Array[0] = 0x4C;
        uint8Array[1] = 0x6F;
        uint8Array[2] = 0xA7;
        uint8Array[3] = 0x94;
        
        const encoding = decoderUtils.guessEncoding(uint8Array);
        expect(encoding).toBe('ebcdic');
      });
      
      it('Can guess UTF-8 (other)', () => {
        const uint8Array = new Uint8Array(4);
        uint8Array[0] = 0x3C;
        uint8Array[1] = 0x41;
        uint8Array[2] = 0x2F;
        uint8Array[3] = 0x3E;
        
        const encoding = decoderUtils.guessEncoding(uint8Array);
        expect(encoding).toBe('utf-8');
      });
      
    });
    
    describe('Reads all xml documents and guesses their encoding', () => {
      const decoderUtils = new xmlazy.DecoderUtils();
      let dirIndex = 0;
      const dirs = [`${__dirname}/${startdir}`];
      const fileNames = [];
      
      while (dirIndex < dirs.length) {
        let dir = dirs[dirIndex++];
        const files = fs.readdirSync(dir);
        for (var i = 0; i < files.length; i++){
          var fileName = path.join(dir, files[i]);
          var stat = fs.lstatSync(fileName);
          if (stat.isDirectory()) {
            dirs.push(fileName);
          }
          else
          if (fileName.endsWith('.xml')) {
            fileNames.push(fileName);
          }
          else {
            // noop.
          }
        }
      }
      
      test.each(fileNames)('Guess encoding of %s', async (fileName) => {
        
        const stream = fs.createReadStream(fileName, {
          start: 0,
          end: 1024
        });
        
        const myTest = async function(){
          return new Promise(function(resolve, reject){
            stream.on('readable', function(){
              const buffer = stream.read();
              if (buffer === null) {
                resolve(true);
                return;
              }
              
              const tmpEncoding = decoderUtils.guessEncoding(buffer);
              expect(buffer instanceof Uint8Array).toBe(true);
              
              const decoder = decoderUtils.createDecoderForXml(buffer);
              expect(decoder instanceof TextDecoder).toBe(true);
              
              const fileNameParts = fileName.split('.');
              fileNameParts.pop();
              const extension = fileNameParts.pop();
              expect(decoder.encoding).toBe(extension);
              
              resolve(true);
            });
          });
        }
        
        await myTest();
      });
      
    });
    
  }
  
});
