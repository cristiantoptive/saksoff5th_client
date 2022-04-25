/* eslint-disable eqeqeq */
/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const package = require("./package.json");
const replace = require("replace-in-file");
const dayjs = require("dayjs");

const timeStamp = dayjs().format("YYYYMMDD");

const options = {
  files: [
    "src/environments/environment.ts",
    "src/environments/environment.prod.ts",
  ],
  from: [
    /version: "(.*)"/g,
    /buildNumber: "(.*)"/g,
  ],
  to: [
    `version: "${package.version}"`,
    `buildNumber: "${timeStamp}"`,
  ],
  allowEmptyPaths: false,
};

try {
  const changedFiles = replace.sync(options);

  if (changedFiles == 0) {
    throw `Please make sure that the file '${unchangedFile.file}' has 'version: ""'` + "' and 'buildNumber: \"\"'";
  }

  console.log(`App version is set to: ${package.version}`);
  console.log(`Build timestamp is set to: ${timeStamp}`);
} catch (error) {
  console.error("Error occurred:", error);
  throw error;
}
