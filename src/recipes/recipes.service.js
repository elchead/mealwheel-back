const file = require("../utils/file");

/**
 * fetch recipe data by calling python
 * @return {string}
 */
function getRecipes(nbrRecipes, ids) {
  filename = "./src/data-science/run.py";
  const py = new file.PythonExecutor(filename, nbrRecipes, ids);
  return py.getStringOutput();
}
exports.getRecipes = getRecipes;
