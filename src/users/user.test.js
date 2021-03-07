// DESTROYS PRODUCTION DB!!! (due to env problem)
const expect = require("chai").expect;
const mongoose = require("mongoose");
const service = require("./user.service");
const { dbConnect, dbDisconnect } = require("../../test/utils");
describe("users", () => {
  before(async () => {
    process.env.MONGO_URL = undefined;
    dbConnect();
  });
  after(() => dbDisconnect());
  const testUser = require("./testUser.json");
  it("should create", async () => {
    const newUser = await service.create(testUser);
    const users = await service.getAll();
    expect(users.length).to.equal(1);
  });
  it("should authenticate", async () => {
    const user = await service.authenticate(testUser);
    expect(user.username).to.equal(testUser.username);
  });
});