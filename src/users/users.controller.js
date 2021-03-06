﻿/* eslint-disable require-jsdoc */
const express = require("express");
const router = express.Router();
const userService = require("./user.service");
const recommend = require("../recipes/recipes.service");
// routes
router.post("/authenticate", authenticate);
router.post("/register", register);
router.get("/", getAll);
router.get("/current", getCurrent);
router.get("/:id", getById);
router.put("/:id", update);
router.delete("/:id", _delete);
router.post("/:id/saveRecipe", saveRecipe);
router.get("/:id/favRecipes", getFavoriteRecipes);
router.post("/:id/deleteRecipe/:recipeId", deleteRecipe);
router.post("/:id/checkRecipe/:recipeId", isRecipeInDb);
router.put("/:id/weekPlan/:day", updateDay); // day: mo,tu,we,th,fr,sa,su
router.get("/:id/daysToBeUpdated", getDaysToBeUpdated);
router.get("/:id/weekPlan", getWeekPlan);
router.get("/:id/recipes", getRecommended);
module.exports = router;

function getRecommended(req, res, next) {
  const t = async function (req, res, next) {
    const nbrRecipes = Number(req.query.nbr) || 3;
    const ids = await userService.getFavoriteRecipeIds(req.params.id);
    // console.log(ids);
    const recipe = await recommend
      .getRecipes(nbrRecipes, ids)
      .catch(console.error);
    res.json(JSON.parse(recipe));
  };
  t(req, res, next);
}

function authenticate(req, res, next) {
  userService
    .authenticate(req.body)
    .then((user) =>
      user
        ? res.json(user)
        : res.status(400).json({ message: "Username or password is incorrect" })
    )
    .catch((err) => next(err));
}

function register(req, res, next) {
  userService
    .create(req.body)
    .then(() => res.json({}))
    .catch((err) => next(err));
}

function getAll(req, res, next) {
  userService
    .getAll()
    .then((users) => res.json(users))
    .catch((err) => next(err));
}

function getCurrent(req, res, next) {
  userService
    .getById(req.user.sub)
    .then((user) => (user ? res.json(user) : res.sendStatus(404)))
    .catch((err) => next(err));
}

function getById(req, res, next) {
  userService
    .getById(req.params.id)
    .then((user) => (user ? res.json(user) : res.sendStatus(404)))
    .catch((err) => next(err));
}

function update(req, res, next) {
  userService
    .update(req.params.id, req.body)
    .then(() => res.json({}))
    .catch((err) => next(err));
}

function _delete(req, res, next) {
  userService
    .delete(req.params.id)
    .then(() => res.json({}))
    .catch((err) => next(err));
}

function saveRecipe(req, res, next) {
  userService
    .saveRecipe(req.params.id, req.body.recipe)
    .then(() => res.json({}))
    .catch((err) => next(err));
}

function deleteRecipe(req, res, next) {
  userService
    .deleteRecipe(req.params.id, req.params.recipeId)
    .then(() => res.json({}))
    .catch((err) => next(err));
}

function isRecipeInDb(req, res, next) {
  userService
    .isRecipeInDb(req.params.id, req.params.recipeId)
    .then((found) => {
      res.send(found);
    })
    .catch((err) => next(err));
}

function updateDay(req, res, next) {
  userService
    .updateDay(req.params.id, req.params.day, req.body.recipe)
    .then(() => res.json({}))
    .catch((err) => next(err));
}

function getDaysToBeUpdated(req, res, next) {
  userService
    .getDaysToBeUpdated(req.params.id)
    .then((days) => res.json({ days: days }))
    .catch((err) => next(err));
}

function getWeekPlan(req, res, next) {
  userService
    .getWeekPlan(req.params.id)
    .then((days) => res.json(days))
    .catch((err) => next(err));
}

function getFavoriteRecipes(req, res, next) {
  userService
    .getFavoriteRecipes(req.params.id)
    .then((recipes) => res.json(recipes))
    .catch((err) => next(err));
}
