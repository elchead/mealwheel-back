const express = require("express");
const router = express.Router();

// /* GET home page. */
// router.get("/", function (req, res, next) {
//   res.render("index", { title: "Express" });
// });

const recommend = require("../controllers/recommender");
router.get("/recipes", async function (req, res, next) {
  const recipe = await recommend.getRecipes().catch(console.error);
  res.json(JSON.parse(recipe));
});
module.exports = router;
