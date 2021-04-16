const express = require("express");
const router = express.Router();

// /* GET home page. */
// router.get("/", function (req, res, next) {
//   res.render("index", { title: "Express" });
// });

const recommend = require("./recipes.service");
router.get("/recipes", async function (req, res, next) {
  // req.query: ?nbr=3 : number of recipes to be returned
  const nbrRecipes = Number(req.query.nbr) || 3;
  const recipe = await recommend.getRecipes(nbrRecipes).catch(console.error);
  res.json(JSON.parse(recipe));
});

router.get("/recipes", async function (req, res, next) {
  // req.query: ?nbr=3 : number of recipes to be returned
  const nbrRecipes = Number(req.query.nbr) || 3;
  const recipe = await recommend.getRecipes(nbrRecipes).catch(console.error);
  res.json(JSON.parse(recipe));
});
module.exports = router;
