const config = require("../../db-config.json");
const mongoose = require("mongoose");
const connectionOptions = {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
};

// const mongoUrl = process.env.MONGO_URL || config.connectionString;
// mongoose.connect(mongoUrl, connectionOptions);
// mongoose.Promise = global.Promise;

module.exports = {
  User: require("../users/user.model"),
};
