const express = require("express");
const recommend = require("./controllers/recommender");

const app = express();
app.get("/test", (req, res) => {
  res.send(`${Date.now()}`);
});
app.get("/hi", (req, res) => {
  res.send(`hi`);
});
app.get("/recipes", function (req, res, next) {
  recommend
    .get_recipes()
    .then((recipe) => {
      res.send(recipe);
    })
    .catch((err) => {
      console.log(err);
    });
});
app.listen(5000);
module.exports = app; // for testing
