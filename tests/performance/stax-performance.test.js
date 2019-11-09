require('babel-polyfill');
const https = require('https');
const fs = require('fs');
const path = require('path');
const yauzl = require("yauzl");

import * as xmlazy from '../../src/xmlazy.js';

const startdir = 'files';

/**
* see: https://www.w3.org/XML/Test/#overview
*/
describe("Performance tests", () => {
  
  const readFile = fileName => {
    return new Promise((resolve, reject) => {
      fs.readFile(fileName, 'utf8', function(err, xml) {
        if (err){
          reject(err);
        }
        resolve(xml);
      });    
    });
  }
  
  describe('Reads all xml documents and can reproduce the source', () => {
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
        
    test.each(fileNames)('Parse %s', async (fileName) => {
      const memoryBefore = process.memoryUsage();
      const fstats = fs.statSync(fileName)
      const xml = await readFile(fileName);
      const start = Date.now();
      let staxReaderResult, count = 0;
      const staxStringReader = new xmlazy.StaxStringReader(xml);
      while (!(staxReaderResult = staxStringReader.next()).done){
        count += 1
      }
      const end = Date.now();
      const expired = end - start;
      console.log(`${fileName}: parsed ${fstats.size} bytes (${xml.length} chars) into ${count} stax events in ${expired}ms. ${Math.round(xml.length/expired)} chars/ms, ${Math.round(count/expired)} events/ms.`);
      const memoryAfter = process.memoryUsage();
      const memoryDiff = {};
      for (let p in memoryAfter) {
        memoryDiff[p] = memoryAfter[p] - memoryBefore[p];
      }
      console.log(memoryDiff);
    });
    
  });

  describe('Reads all xml documents and build a DOM document', () => {
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
    
    test.each(fileNames)('Parse %s', async (fileName) => {
      const xml = await readFile(fileName);
      const start = Date.now();
      let staxReaderResult, count = 0;
      const staxStringReader = new xmlazy.StaxStringReader(xml, {chaiNodes: true});
      while (!(staxReaderResult = staxStringReader.next()).done){
        count += 1
      }
      const end = Date.now();
      const expired = end - start;
      console.log(`${fileName}: parsed ${xml.length} chars into ${count} stax events in ${expired}ms. ${Math.round(xml.length/expired)} chars/ms, ${Math.round(count/expired)} events/ms.`);
    });
    
  });

});
