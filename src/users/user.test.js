const expect = require("chai").expect;
const mongoose = require("mongoose");
const mongoUnit = require("mongo-unit");
const service = require("./user.service");
const dbconfig = require("../../db-config.json");
const testMongoUrl = dbconfig.connectionString; //process.env.MONGO_URL;

describe("users", () => {
  const testUser = require("./testUser.json");
  beforeEach(() => {
    mongoUnit.initDb(testMongoUrl, {});
    service.create(testUser);
  });
  afterEach(() => mongoUnit.drop());
  it("should authenticate", () => {
    return service.authenticate(testUser).then((res) => {
      expect(res.username).to.equal(testUser.username);
    });
  });

  //   it("should create new task", () => {
  //     return service
  //       .addTask({ name: "next", completed: false })
  //       .then((task) => {
  //         expect(task.name).to.equal("next");
  //         expect(task.completed).to.equal(false);
  //       })
  //       .then(() => service.getTasks())
  //       .then((tasks) => {
  //         expect(tasks.length).to.equal(2);
  //         expect(tasks[1].name).to.equal("next");
  //       });
  //   });

  //   it("should remove task", () => {
  //     return service
  //       .getTasks()
  //       .then((tasks) => tasks[0]._id)
  //       .then((taskId) => service.deleteTask(taskId))
  //       .then(() => service.getTasks())
  //       .then((tasks) => {
  //         expect(tasks.length).to.equal(0);
  //       });
  //   });
});
