// Import the dependencies for testing
const { expect } = require("chai");
const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../index");
// Configure chai
chai.use(chaiHttp);
chai.should();

describe("recipes", () => {
  it("should fetch", (done) => {
    chai
      .request(server)
      .get("/recipes")
      .end((err, res) => {
        res.should.have.status(200);
        console.log(res.body.Ingredients);
        expect(res).to.be.json;
        const expected = {
          Ingredients: ["Apple", "Banana"],
          Steps: "Do that...",
        };
        res.body.should.be.eql(expected);
        done();
      });
  });
});
