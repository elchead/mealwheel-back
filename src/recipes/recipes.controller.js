const file = require("../utils/file");

/**
 * fetch recipe data by calling python
 * @return {string}
 */
function getRecipes() {
  filename = "./src/run.py";
  const py = new file.PythonExecutor(filename);
  return py.getStringOutput();
}
exports.getRecipes = getRecipes;
