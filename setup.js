#!/usr/bin/env node

const fs = require("fs");

const FILES = {
  "prettier.config.js": `\
var config = require("@graham42/prettier-config");
module.exports = config;
`,
  ".prettierignore": `\
node_modules/
# npm install does its' own formatting of the package.json and package-lock.json
# files
package*.json
`,
};

if (!fs.existsSync("package.json")) {
  console.error(
    "No package.json found in the current directory. Make sure you are in the project root. If no package.json exists yet, run `npm init` first.",
  );
  process.exit(1);
}

Object.keys(FILES).forEach(fileName => {
  if (fs.existsSync(fileName)) {
    console.error(`${fileName} already exists. Aborting.`);
    process.exit(1);
  }
});

Object.keys(FILES).forEach(fileName => {
  fs.writeFileSync(fileName, FILES[fileName], "utf8");
});

require("child_process").execSync(
  "npm install --save-dev @graham42/prettier-config prettier",
  { stdio: "inherit" },
);
