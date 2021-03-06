const PORT = process.env.PORT || 4000;
require("dotenv").config();
downloadFiles = require("./data-science/downloader");
// downloadFiles();
const express = require("express");
const app = express();
const cors = require("cors");
const jwt = require("./_helpers/jwt");

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors({ credentials: true, origin: true }));

// use JWT auth to secure the api
const recipeRoutes = require("./recipes/recipes.controller");
app.use("/", recipeRoutes);

// api routes
app.use(jwt()); // TODO include Auth before end point
app.use("/users", require("./users/users.controller"));

app.listen(PORT);
console.log(`listening on: http://localhost:${PORT}`);
module.exports = app; // for testing
