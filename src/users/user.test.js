const expect = require("chai").expect;
const service = require("./user.service");
const { dbConnect, dbDisconnect } = require("../../test/utils");
// const isEqual = require("deep-equal");
// const mongoose = require("mongoose");

const isEqual = (a, b) => {
  return JSON.stringify(a) === JSON.stringify(b);
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
  const testUser = require("./testUser.json");
  it("should create", async () => {
    const newUser = await service.create(testUser);
    const users = await service.getAll();
    expect(isEqual(newUser, users[0])).to.equal(true);
  });
  it("should authenticate", async () => {
    const user = await service.authenticate(testUser);
    expect(user.username).to.equal(testUser.username);
  });
  it("should save recipe", async () => {
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
    };
    const user = await service.authenticate(testUser);
    await service.saveRecipe(user.id, recipe);
    const isSaved = await service.checkRecipe(user.id, recipe.id);
    expect(isSaved).to.equal(true);
  });

  it("should delete", async () => {
    const user = await service.authenticate(testUser);
    await service.delete(user.id);
    const users = await service.getAll();
    expect(users.length).to.equal(0);
  });
});
