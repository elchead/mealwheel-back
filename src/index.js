const express = require("express");
const recommend = require("./controllers/recommender");

const app = express();

const recipeRoutes = require("./routes/recipes");
app.use("/", recipeRoutes);

app.get("/test", (req, res) => {
  res.send(`${Date.now()}`);
});
app.get("/hi", (req, res) => {
  res.send(`hi`);
});

app.listen(5000);
console.log("listening on: http://localhost:5000/recipes");
module.exports = app; // for testing
