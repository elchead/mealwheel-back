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
    const expected = [
      {
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
      },
      {
        name: "a bit different breakfast pizza",
        id: 31490,
        minutes: 30,
        nutrition: [173.4, 18.0, 0.0, 17.0, 22.0, 35.0, 1.0],
        steps: [
          "preheat oven to 425 degrees f",
          "press dough into the bottom and sides of a 12 inch pizza pan",
        ],
        description:
          "this recipe calls for the crust to be prebaked a bit before adding ingredients. feel free to change",
      },
      {
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
      },
    ];
    recipe.should.be.eql(expected);
  });
});
