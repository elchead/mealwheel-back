// Import the dependencies for testing
const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../src/index");
// Configure chai
chai.use(chaiHttp);
chai.should();

describe("/test", () => {
  it("tester", (done) => {
    chai
      .request(server)
      .get("/hi")
      .end((err, res) => {
        res.should.have.status(200);
        res.text.should.be.a("string");
        res.text.should.be.eql("hi");
        done();
      });
  });
});
