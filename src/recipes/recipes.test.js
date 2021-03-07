// Import the dependencies for testing
const { expect } = require("chai");
const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../index");
const recommend = require("./recipes.service");
// Configure chai
chai.use(chaiHttp);
chai.should();

describe("recipes", () => {
  it("should fetch", async () => {
    // chai;
    const res = await recommend.getRecipes().catch(console.error);
    const recipe = JSON.parse(res);
    const expected = {
      Ingredients: ["Apple", "Banana"],
      Steps: "Do that...",
    };
    recipe.should.be.eql(expected);
  });
});
