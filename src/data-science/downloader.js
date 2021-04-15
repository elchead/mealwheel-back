const fs = require("fs");
const Path = require("path");
const axios = require("axios");

function fileExists(path) {
  return fs.existsSync(path);
}

// eslint-disable-next-line require-jsdoc
async function downloadFile(url, filename) {
  targetpath = Path.resolve(__dirname, filename);
  if (fileExists(targetpath)) {
    console.log(`${filename} files already exist`);
    return;
  }
  url = `${url}/${filename}`;
  // axios image download with response type "stream"
  const response = await axios({
    method: "GET",
    url: url,
    responseType: "stream",
  });

  // pipe the result stream into a file on disc
  response.data.pipe(fs.createWriteStream(targetpath));

  // return a promise and resolve when download finishes
  return new Promise((resolve, reject) => {
    response.data.on("end", () => {
      resolve();
    });

    response.data.on("error", () => {
      reject();
    });
  });
}

// eslint-disable-next-line require-jsdoc
async function downloadDSFiles() {
  url = "https://mealwheel.s3.eu-central-1.amazonaws.com/data-science";
  console.log("Started downloads");
  await downloadFile(url, "dataset.pkl");
  await downloadFile(url, "recmodel.pkl");
  await downloadFile(url, "RAW_recipes.csv");
}

const main = async () => {
  await downloadDSFiles();
  console.log("Finished downloads");
};
// main();

module.exports = main;
