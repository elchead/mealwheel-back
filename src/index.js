const PORT = process.env.PORT || 4000;
require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const jwt = require("./_helpers/jwt");
const errorHandler = require("./_helpers/error-handler");

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors());

app.get("/test", (req, res) => {
  res.send(`${Date.now()}`);
});

// use JWT auth to secure the api
const recipeRoutes = require("./recipes/recipes.service");
app.use("/", recipeRoutes);
app.use(jwt()); // TODO include Auth before end point

// api routes
app.use("/users", require("./users/users.controller"));

app.listen(PORT);
console.log("listening on: http://localhost:4000/recipes");
module.exports = app; // for testing
