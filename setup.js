#!/usr/bin/env node
//@ts-check

const fs = require("fs");
const path = require('path')
const meow = require("meow");

if (!fs.existsSync("package.json")) {
  console.error(
    "No package.json found in the current directory. Make sure you are in the project root. If no package.json exists yet, run `npm init` first.",
  );
  process.exit(1);
}

let cli = meow(
  `
  Usage: npx @graham42/prettier-config [--es5]
  `,
  {
    flags: {
      es5: { type: "boolean"},
    },
  },
)

let prettierConfigRaw = fs.readFileSync(path.join(__dirname, 'index.js'), 'utf8')
prettierConfigRaw= prettierConfigRaw.replace(/\/\/@ts-check/, '')
if (cli.flags.es5) {
  prettierConfigRaw=prettierConfigRaw.replace(/trailingComma:\s*['"]all['"]/, `trailingComma: "es5"`)
}
prettierConfigRaw = `\
// This file and the npm scripts 'fix:format' and 'lint:format' were generated
// with 'npx @graham42/prettier-config'
` + prettierConfigRaw

// Write prettier config files
const CONFIG_FILES = {
  "prettier.config.js": prettierConfigRaw,
  ".prettierignore": `\
node_modules/
# npm install does its' own formatting of the package.json and package-lock.json
# files
package*.json
`,
};
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
pkg.scripts = migrateFromV1(pkg.scripts)
pkg.scripts["lint:format"] = `prettier --list-different '${targetFilesGlob}' `;
pkg.scripts["fix:format"] = `prettier --write '${targetFilesGlob}' `;
fs.writeFileSync("package.json", JSON.stringify(pkg, null, 2), "utf8");


require("child_process").execSync(
  "npm install --save-dev prettier@^2",
  { stdio: "inherit" },
);

/**
 * @param {{checkFormat?: string, format?: string}} scripts
 */
function migrateFromV1(scripts) {
  let newScripts = {
    ...scripts
  }
  if (scripts.checkFormat && scripts.checkFormat.startsWith('prettier --list-different')) {
    delete newScripts.checkFormat
  }
  if (scripts.format && scripts.format.startsWith('prettier --write')){
    delete newScripts.format
  }
  return newScripts
}