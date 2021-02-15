class FileError extends Error {
  constructor(message) {
    super(message);
    this.name = "File is not existent";
  }
}

const isFileExistent = (filepath) => {
  const fs = require("fs");
  if (!fs.existsSync(filepath)) {
    throw new FileError(filepath);
  }
};

const spawn = require("child_process").spawn;
// not working
class PythonExecutor {
  constructor(filepath) {
    this.path = filepath;
    this.process = spawn("python", [filepath]);
  }
  getOutput() {
    try {
      console.log(isFileExistent(this.path));
    } catch (err) {
      console.error(err);
    }
    var res = "";
    const processo = spawn("python", [this.path]);
    processo.stdout.on("data", (data) => {
      data = data.toString();
      res += data;
    });
    console.log(res);
    // console.log(res);
    // pythonProcess.on("close", (code) => {
    //   resolve(res);
    // });
    // pythonProcess.on("error", (err) => {
    //   console.error(err);
    //   reject(err);
    // });
    return res;
  }
}
module.exports = { FileError, PythonExecutor, isFileExistent };
