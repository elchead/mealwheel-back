class FileError extends Error {
  constructor(message) {
    super(message);
    this.name = "File is not existent";
  }
}

const isFileExistent = (filepath) => {
  const fs = require("fs");
  if (!fs.existsSync(filename)) {
    throw new FileError(filename);
  }
};
module.exports = { FileError, isFileExistent };
