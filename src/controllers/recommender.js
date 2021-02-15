const file = require("../utils/file");

const get_recipes = () => {
  filename = "./src/run.py";
  try {
    file.isFileExistent(filename);
  } catch (err) {
    console.error(err);
  }
  return new Promise((resolve, reject) => {
    const spawn = require("child_process").spawn;
    const pythonProcess = spawn("python", [filename]);
    var res = "";
    pythonProcess.stdout.on("data", (data) => {
      data = data.toString();
      res += data;
    });
    pythonProcess.on("close", (code) => {
      resolve(res);
    });
    pythonProcess.on("error", (err) => {
      console.error(err);
      reject(err);
    });
  });
};
get_recipes();
exports.get_recipes = get_recipes;
