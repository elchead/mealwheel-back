// Import the dependencies for testing
const { expect } = require("chai");
const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../index");
const recommend = require("./recipes.service");
// Configure chai
chai.use(chaiHttp);
chai.should();

const recipe = {
  name: "arriba baked winter squash mexican style",
  id: 137739,
  minutes: 55,
  nutrition: [51.5, 0.0, 13.0, 0.0, 2.0, 0.0, 4.0],
  steps: [
    "make a choice and proceed with recipe",
    "depending on size of squash , cut into half or fourths",
  ],
  description:
    "autumn is my favorite time of year to cook! this recipe can be prepared either spicy or sweet",
  ingredients: [
    "winter squash",
    "mexican seasoning",
    "mixed spice",
    "honey",
    "butter",
    "olive oil",
    "salt",
  ],
};

const recipe2 = {
  name: "a bit different breakfast pizza",
  id: 31490,
  minutes: 55,
  nutrition: [51.5, 0.0, 13.0, 0.0, 2.0, 0.0, 4.0],
  steps: [
    "make a choice and proceed with recipe",
    "depending on size of squash , cut into half or fourths",
  ],
  description:
    "autumn is my favorite time of year to cook! this recipe can be prepared either spicy or sweet",
  ingredients: [
    "prepared pizza crust",
    "sausage patty",
    "eggs",
    "milk",
    "salt and pepper",
    "cheese",
  ],
};

// describe("recipes", () => {
//   it("should fetch", async () => {
//     // chai;
//     const res = await recommend.getRecipes().catch(console.error);
//     const recipe = JSON.parse(res);
//     const expected = [recipe, recipe2, recipe];
//     recipe.should.be.eql(expected);
//   });
// });
