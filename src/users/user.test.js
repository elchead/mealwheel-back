const expect = require("chai").expect;
const service = require("./user.service");
const { dbConnect, dbDisconnect } = require("../../test/utils");
// const isEqual = require("deep-equal");

const isEqual = (a, b) => {
  return JSON.stringify(a) === JSON.stringify(b);
};
describe("users", () => {
  before(async () => {
    // process.env.MONGO_URL = undefined;
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
  it("should delete", async () => {
    const user = await service.authenticate(testUser);
    await service.delete(user.id);
    const users = await service.getAll();
    expect(users.length).to.equal(0);
  });
});
