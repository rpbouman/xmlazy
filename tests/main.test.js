import * as xmlazy from '../src/xmlazy.js';


describe("SaxStringReader", () => {

  it("Can instantiate a SaxStringReader", () => {
    const saxStringReader = new xmlazy.SaxStringReader('<hello/>');
  });

});
