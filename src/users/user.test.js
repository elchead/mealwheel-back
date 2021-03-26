/* eslint-disable require-jsdoc */
const chai = require("chai").use(require("chai-as-promised"));
const expect = chai.expect;
const service = require("./user.service");
const { dbConnect, dbDisconnect } = require("../../test/utils");
const testUser = require("./testUser.json");
const db = require("../_helpers/db");

const isEqual = (a, b) => {
  return JSON.stringify(a) === JSON.stringify(b);
};

async function isValidLogin(testUser) {
  const user = await service.authenticate(testUser);
  expect(user.username).to.equal(testUser.username);
  return true;
}
let userId = undefined;

const recipe = {
  name: "arriba baked winter squash mexican style",
  id: 1,
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
  name: "pizza",
  id: 2,
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
describe("users", () => {
  before(async () => {
    // process.env.MONGO_URL = undefined;
    // const connectionOptions = {
    //   useCreateIndex: true,
    //   useNewUrlParser: true,
    //   useUnifiedTopology: true,
    //   useFindAndModify: false,
    // };
    // mongoose.connect(process.env.MONGO_URL, connectionOptions);
    dbConnect();
  });
  after(() => dbDisconnect());
  beforeEach(async () => {
    await db.User.deleteMany({});
    const user = await service.create(testUser);
    userId = user.id;
  });

  it("should create", async () => {
    const users = await service.getAll();
    expect(users.length).to.equal(1);
  });
  it("should not create duplicate accounts", async () => {
    await expect(service.create(testUser)).to.be.rejected;
  });
  it("should delete", async () => {
    await service.delete(userId);
    const users = await service.getAll();
    expect(users.length).to.equal(0);
  });
  it("should authenticate", () => isValidLogin(testUser));
  it("should not authenticate wrong credentials", async () => {
    await expect(isValidLogin({ ...testUser, password: "wrong" })).to.be
      .rejected;
  });
  it("should update credentials", async () => {
    const modUser = { ...testUser, password: "new" };
    await service.update(userId, modUser);
    expect(isValidLogin(modUser)).to.eventually.equal(true);
  });
  it("should save recipe", async () => {
    await service.saveRecipe(userId, recipe);
    const isSaved = await service.isRecipeInDb(userId, recipe.id);
    expect(isSaved).to.equal(true);
  });
  it("should delete selected recipe", async () => {
    await service.saveRecipe(userId, recipe);
    const otherId = recipe.id + 1;
    await service.saveRecipe(userId, { ...recipe, id: otherId });
    await service.deleteRecipe(userId, recipe.id);
    const isSaved = await service.isRecipeInDb(userId, recipe.id);
    expect(isSaved).to.equal(false);
    const isOtherSaved = await service.isRecipeInDb(userId, otherId);
    expect(isOtherSaved).to.equal(true);
  });
  it("should get favorite recipes", async () => {
    await service.saveRecipe(userId, recipe);

    await service.saveRecipe(userId, recipe2);
    const favRecipes = await service.getFavoriteRecipes(userId);
    expect(favRecipes.map((e) => e.id)).to.include(recipe.id);
    expect(favRecipes.map((e) => e.id)).to.include(recipe2.id);
  });
  it("should update week plan", async () => {
    await service.updateDay(userId, "mo", recipe);
    await service.updateDay(userId, "fr", recipe);
    const daysToUpdate = await service.getDaysToBeUpdated(userId);
    expect(daysToUpdate.find((e) => e === "mo")).to.equal(undefined);
    expect(daysToUpdate.find((e) => e === "fr")).to.equal(undefined);
    expect(daysToUpdate.find((e) => e === "su")).to.not.equal(undefined);
    expect(daysToUpdate.find((e) => e === "tu")).to.not.equal(undefined);
  });

  it("should extract ingredients", async () => {
    await service.updateDay(userId, "mo", recipe);
    await service.updateDay(userId, "fr", recipe2);
    const ingredients = await service.getIngredients(userId);
    const expIngredients = recipe.ingredients.concat(recipe2.ingredients);
    expect(ingredients).to.eql(expIngredients);
  });
});
