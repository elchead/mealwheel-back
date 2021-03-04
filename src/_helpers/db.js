const config = require("config");
const mongoose = require("mongoose");
const connectionOptions = {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
};

if (config.util.getEnv("NODE_CONFIG_ENV") != "test") {
  mongoose.connect(process.env.MONGO_URL, connectionOptions);
}
// mongoose.Promise = global.Promise;

module.exports = {
  User: require("../users/user.model"),
};
