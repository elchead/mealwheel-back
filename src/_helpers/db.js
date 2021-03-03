const config = require("../../db-config.json");
const mongoose = require("mongoose");
const connectionOptions = {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
};

// const mongoUrl = process.env.MONGO_URL || coynfig.connectionString;
// if (process.env.MONGO_URL === undefined)
mongoose.connect(process.env.MONGO_URL, connectionOptions);
// mongoose.Promise = global.Promise;

module.exports = {
  User: require("../users/user.model"),
};
