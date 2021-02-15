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
/**
 * Helper class to execute python and fetch data stream (flushed from python print)
 */
class PythonExecutor {
  /**
   *
   * @param {string} filepath : relative filepath starting from root dir
   */
  constructor(filepath) {
    this.path = filepath;
    this.process = spawn("python", [filepath]);
    try {
      isFileExistent(this.path);
    } catch (err) {
      console.error(err);
    }
  }
  /**
   * Get string output from python print statements
   * @return {Promise<string>} : contains string
   */
  getStringOutput() {
    return new Promise((resolve, reject) => {
      let res = "";
      this.process.stdout.on("data", (data) => {
        data = data.toString();
        res += data;
      });
      this.process.on("close", (code) => {
        resolve(res);
      });
      this.process.on("error", (err) => {
        console.error(err);
        reject(err);
      });
    });
  }
}
module.exports = { FileError, PythonExecutor, isFileExistent };
