/* eslint-disable require-jsdoc */
const config = require("config");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("../_helpers/db");
const User = db.User;

module.exports = {
  authenticate,
  getAll,
  getById,
  create,
  update,
  delete: _delete,
  saveRecipe,
  deleteRecipe,
  checkRecipe,
};

async function authenticate({ username, password }) {
  const user = await User.findOne({ username });
  if (user && bcrypt.compareSync(password, user.hash)) {
    const token = jwt.sign({ sub: user.id }, config.get("secret"), {
      expiresIn: "7d",
    });
    return {
      ...user.toJSON(),
      token,
    };
  }
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
    throw 'Username "' + userParam.username + '" is already taken';
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
  const user = await User.findById(id);

  // validate
  if (!user) throw "User not found";
  if (
    user.username !== userParam.username &&
    (await User.findOne({ username: userParam.username }))
  ) {
    throw 'Username "' + userParam.username + '" is already taken';
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
  const user = await User.findById(userId);

  // validate
  if (!user) throw Error("User not found");
  console.log(user);
  if (!isRecipeFound(user.recipes, recipe.id))
    user.recipes = [...user.recipes, recipe];
  user.save();
}

async function deleteRecipe(userId, recipeId) {
  const user = await User.findById(userId);
  // validate
  if (!user) throw Error("User not found");
  user.recipes = user.recipes.filter((item) => item.id != recipeId);
  user.save();
}

async function checkRecipe(userId, recipeId) {
  const user = await User.findById(userId);
  // validate
  if (!user) throw Error("User not found");
  let isFound = user.recipes.find(({ id }) => id === recipeId);
  isFound = isFound === undefined ? false : true;
  return isFound;
}
