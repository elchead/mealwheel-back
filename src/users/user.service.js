/* eslint-disable require-jsdoc */
const config = require("config");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("../_helpers/db");
const User = db.User;
var _ = require("lodash/core");

module.exports = {
  authenticate,
  getAll,
  getById,
  getByUsername,
  create,
  update,
  delete: _delete,
  saveRecipe,
  getFavoriteRecipes,
  getFavoriteRecipeIds,
  deleteRecipe,
  isRecipeInDb: isRecipeInDb,
  updateDay,
  getDaysToBeUpdated,
  getWeekPlan,
};

async function getByUsername(username) {
  console.log(username);
  const user = await User.findOne({ username });
  if (!user) throw Error("Username " + username + " is not found");
  return user;
}

async function authenticate({ username, password }) {
  const user = await getByUsername(username);
  if (user && bcrypt.compareSync(password, user.hash)) {
    const token = jwt.sign({ sub: user.id }, config.get("secret"), {
      expiresIn: "7d",
    });
    return {
      ...user.toJSON(),
      token,
    };
  } else throw Error("Invalid credentials");
}

async function getAll() {
  return await User.find();
}

async function getById(id) {
  return await User.findById(id);
}

async function create(userParam) {
  // validate
  if (await User.findOne({ username: userParam.username })) {
    throw Error("Username " + userParam.username + " is already taken");
  }

  const user = new User(userParam);

  // hash password
  if (userParam.password) {
    user.hash = bcrypt.hashSync(userParam.password, 10);
  }

  // save user
  return await user.save();
}

async function update(id, userParam) {
  const user = await getById(id);

  // validate
  if (!user) throw Error("User not found");
  if (
    user.username !== userParam.username &&
    (await User.findOne({ username: userParam.username }))
  ) {
    throw Error("Username " + userParam.username + " is already taken");
  }

  // hash password if it was entered
  if (userParam.password) {
    userParam.hash = bcrypt.hashSync(userParam.password, 10);
  }

  // copy userParam properties to user
  Object.assign(user, userParam);

  await user.save();
}

async function _delete(id) {
  await User.findByIdAndRemove(id);
}

const isRecipeFound = (recipes, recipeId) => {
  return recipes.find((recipe) => recipe.id === recipeId);
};

async function saveRecipe(userId, recipe) {
  const user = await getById(userId);

  // validate
  if (!user) throw Error("User not found");
  const idxFound = isRecipeFound(user.recipes, recipe.id);
  if (!idxFound) {
    user.recipes = [...user.recipes, recipe];
  } else {
    user.recipes[idxFound] = recipe;
  }
  await user.save();
  return user;
}

async function getFavoriteRecipeIds(userId) {
  const recipes = await getFavoriteRecipes(userId);
  const ids = [];
  recipes.forEach((recipe) => {
    ids.push(recipe.id);
  });
  return ids;
}
async function getFavoriteRecipes(userId) {
  const user = await getById(userId);
  // validate
  if (!user) throw Error("User not found");
  return [...user.recipes];
}

async function deleteRecipe(userId, recipeId) {
  const user = await getById(userId);
  // validate
  if (!user) throw Error("User not found");
  user.recipes = user.recipes.filter((item) => item.id != recipeId);
  await user.save();
}

async function isRecipeInDb(userId, recipeId) {
  const user = await getById(userId);
  // validate
  if (!user) throw Error("User not found");
  let isFound = false;
  if (user.recipes) {
    isFound = user.recipes.find(({ id }) => id === parseInt(recipeId));
    isFound = isFound === undefined ? false : true;
  }
  return isFound;
}

function getNumberOfWeek() {
  const today = new Date();
  const firstDayOfYear = new Date(today.getFullYear(), 0, 1);
  const pastDaysOfYear = (today - firstDayOfYear) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}

async function updateDay(userId, day, recipe) {
  const user = await getById(userId);
  // validate
  if (!user) throw Error("User not found");
  user.weekPlan[day].recipe = recipe;
  user.weekPlan[day].lastUpdatedWeek = getNumberOfWeek();
  await user.save();
}
async function getDaysToBeUpdated(userId) {
  const user = await getById(userId);
  // validate
  if (!user) throw Error("User not found");
  const currWeek = getNumberOfWeek();
  let days = [];
  Object.entries(user.weekPlan).forEach(([day, obj]) => {
    if (obj.lastUpdatedWeek != currWeek) days.push(day);
  });
  days = days.slice(1); // skip init entry
  return days;
}

async function getWeekPlan(userId) {
  const user = await getById(userId);
  // validate
  if (!user) throw Error("User not found");
  let days = {};
  Object.entries(user.weekPlan).forEach(([day, obj]) => {
    days[day] = obj.recipe;
  });
  return days;
}
