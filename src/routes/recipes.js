const express = require("express");
const router = express.Router();

// /* GET home page. */
// router.get("/", function (req, res, next) {
//   res.render("index", { title: "Express" });
// });

const recommend = require("../controllers/recommender");
router.get("/recipes", function (req, res, next) {
  recommend
    .get_recipes()
    .then((recipe) => {
      res.send(recipe);
    })
    .catch((err) => {
      console.log(err);
    });
});
module.exports = router;
