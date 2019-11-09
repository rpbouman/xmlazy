import * as xmlazy from '../src/xmlazy.js';


describe("StaxStringReader", () => {

  it("Can instantiate a StaxStringReader", () => {
    const staxStringReader = new xmlazy.StaxStringReader('<hello/>');
  });

});
