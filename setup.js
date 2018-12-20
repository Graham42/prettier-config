#!/usr/bin/env node
//@ts-check

const fs = require("fs");

if (!fs.existsSync("package.json")) {
  console.error(
    "No package.json found in the current directory. Make sure you are in the project root. If no package.json exists yet, run `npm init` first.",
  );
  process.exit(1);
}

// Write prettier config files
const CONFIG_FILES = {
  "prettier.config.js": `\
const config = require("@graham42/prettier-config");
module.exports = config;
`,
  ".prettierignore": `\
node_modules/
# npm install does its' own formatting of the package.json and package-lock.json
# files
package*.json
`,
};
Object.keys(CONFIG_FILES).forEach(fileName => {
  if (fs.existsSync(fileName)) {
    console.error(`${fileName} already exists. Aborting.`);
    process.exit(1);
  }
});
Object.entries(CONFIG_FILES).forEach(([fileName, contents]) => {
  fs.writeFileSync(fileName, contents, "utf8");
});

// Update package.json with scripts for formatting and checking format
const PRETTIER_FILE_EXTENSIONS = [
  "js",
  "jsx",
  "ts",
  "tsx",
  "html",
  "vue",
  "css",
  "less",
  "scss",
  "graphql",
  "yaml",
  "yml",
  "json",
  "md",
  "mdx",
];
const targetFilesGlob = `**/*.{${PRETTIER_FILE_EXTENSIONS.join(",")}}`;
const pkg = JSON.parse(fs.readFileSync("package.json", "utf8"));
pkg.scripts = pkg.scripts || {};
pkg.scripts.checkFormat = `prettier --list-different '${targetFilesGlob}' `;
pkg.scripts.format = `prettier --write '${targetFilesGlob}' `;
fs.writeFileSync("package.json", JSON.stringify(pkg, null, 2), "utf8");

require("child_process").execSync(
  "npm install --save-dev @graham42/prettier-config prettier",
  { stdio: "inherit" },
);
